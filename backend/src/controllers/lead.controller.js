const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const leadInclude = {
  assignedTo: { select: { id: true, name: true, email: true } },
  quotes: true,
  activities: {
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true } } },
  },
};

const getLeads = asyncHandler(async (req, res) => {
  const { status, source, search = "", page = 1, limit = 50 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const where = {
    AND: [
      status ? { status } : {},
      source ? { source } : {},
      search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { company: { contains: search, mode: "insensitive" } },
              { phone: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
    ],
  };

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: leadInclude,
      orderBy: { updatedAt: "desc" },
      skip,
      take,
    }),
    prisma.lead.count({ where }),
  ]);

  // Agrupación por columnas para Kanban comercial
  const kanbanColumns = {
    NUEVO: leads.filter((l) => l.status === "NUEVO"),
    CONTACTADO: leads.filter((l) => l.status === "CONTACTADO"),
    CITA_SHOWROOM: leads.filter((l) => l.status === "CITA_SHOWROOM"),
    COTIZACION_ENVIADA: leads.filter((l) => l.status === "COTIZACION_ENVIADA"),
    NEGOCIACION: leads.filter((l) => l.status === "NEGOCIACION"),
    GANADO: leads.filter((l) => l.status === "GANADO"),
    PERDIDO: leads.filter((l) => l.status === "PERDIDO"),
  };

  res.json({
    success: true,
    data: leads,
    kanban: kanbanColumns,
    pagination: { total, page: Number(page), limit: take, pages: Math.ceil(total / take) },
  });
});

const getLeadById = asyncHandler(async (req, res) => {
  const lead = await prisma.lead.findUnique({
    where: { id: Number(req.params.id) },
    include: leadInclude,
  });
  if (!lead) throw new ApiError(404, "Prospecto no encontrado");
  res.json({ success: true, data: lead });
});

const createLead = asyncHandler(async (req, res) => {
  const { name, email, phone, company, source, status, estimatedBudget, interestSummary, notes, assignedToId } =
    req.body;

  const lead = await prisma.lead.create({
    data: {
      name,
      email: email || null,
      phone,
      company: company || null,
      source: source || "SHOWROOM_DIRECTO",
      status: status || "NUEVO",
      estimatedBudget: estimatedBudget ? Number(estimatedBudget) : null,
      interestSummary: interestSummary || null,
      notes: notes || null,
      assignedToId: assignedToId ? Number(assignedToId) : req.user ? req.user.id : null,
    },
    include: leadInclude,
  });

  res.status(201).json({ success: true, data: lead });
});

const updateLead = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { name, email, phone, company, source, status, estimatedBudget, interestSummary, notes, assignedToId } =
    req.body;

  const existing = await prisma.lead.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Prospecto no encontrado");

  const lead = await prisma.lead.update({
    where: { id },
    data: {
      name,
      email: email !== undefined ? email || null : undefined,
      phone,
      company: company !== undefined ? company || null : undefined,
      source,
      status,
      estimatedBudget: estimatedBudget !== undefined ? (estimatedBudget ? Number(estimatedBudget) : null) : undefined,
      interestSummary,
      notes,
      assignedToId: assignedToId !== undefined ? (assignedToId ? Number(assignedToId) : null) : undefined,
    },
    include: leadInclude,
  });

  res.json({ success: true, data: lead });
});

const updateLeadStatus = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  const validStatuses = ["NUEVO", "CONTACTADO", "CITA_SHOWROOM", "COTIZACION_ENVIADA", "NEGOCIACION", "GANADO", "PERDIDO"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Estado de prospecto no válido");
  }

  const lead = await prisma.lead.update({
    where: { id },
    data: { status },
    include: leadInclude,
  });

  res.json({ success: true, data: lead });
});

const deleteLead = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.lead.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Prospecto no encontrado");

  await prisma.lead.delete({ where: { id } });
  res.json({ success: true, message: "Prospecto eliminado correctamente" });
});

const addLeadActivity = asyncHandler(async (req, res) => {
  const leadId = Number(req.params.id);
  const { type, title, description, scheduledAt } = req.body;

  const activity = await prisma.activity.create({
    data: {
      leadId,
      userId: req.user.id,
      type: type || "NOTA",
      title: title || "Nota de seguimiento",
      description,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    },
    include: { user: { select: { id: true, name: true } } },
  });

  res.status(201).json({ success: true, data: activity });
});

module.exports = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  updateLeadStatus,
  deleteLead,
  addLeadActivity,
};
