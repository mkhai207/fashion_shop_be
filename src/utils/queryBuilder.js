const { Op } = require("sequelize");

const buildQuery = async (
  Model,
  query,
  {
    attributes = null,
    allowedFilters = [],
    allowedSorts = [],
    defaultSort = [["id", "ASC"]],
    defaultLimit = 10,
    include = [],
  } = {}
) => {
  try {
    const where = {};
    const operatorMap = {
      gt: Op.gt,
      gte: Op.gte,
      lt: Op.lt,
      lte: Op.lte,
      eq: Op.eq,
      ne: Op.ne,
      like: Op.iLike,
    };

    for (const key of allowedFilters) {
      if (query[key] !== undefined) {
        const rawValues = Array.isArray(query[key]) ? query[key] : [query[key]];

        for (const raw of rawValues) {
          if (typeof raw === "string" && raw.includes(":")) {
            const [op, val] = raw.split(":");
            const sequelizeOp = operatorMap[op];
            if (!sequelizeOp) {
              throw new Error(`Unsupported operator '${op}' for '${key}'`);
            }

            const value =
              op === "like" ? `%${val}%` : isNaN(val) ? val : Number(val);
            if (!where[key]) where[key] = {};
            where[key][sequelizeOp] = value;
          } else {
            // fallback nếu không có toán tử
            where[key] = isNaN(raw) ? raw : Number(raw);
          }
        }
      }
    }

    let order = defaultSort;
    if (query.sort) {
      order = query.sort.split(",").map((param) => {
        const [field, direction = "ASC"] = param.split(":");
        if (!allowedSorts.includes(field)) {
          throw new Error(`Invalid sort field: ${field}`);
        }
        if (!["ASC", "DESC"].includes(direction.toUpperCase())) {
          throw new Error(`Invalid sort direction: ${direction}`);
        }
        return [field, direction.toUpperCase()];
      });
    }

    const limit = Number(query.limit) || defaultLimit;
    const page = Number(query.page) || 1;
    if (isNaN(limit) || limit < 1)
      throw new Error("Limit must be a positive integer");
    if (isNaN(page) || page < 1)
      throw new Error("Page must be a positive integer");
    const offset = (page - 1) * limit;

    const { count, rows } = await Model.findAndCountAll({
      where,
      attributes,
      order,
      limit,
      offset,
      include,
    });

    const totalPages = Math.ceil(count / limit);

    return {
      status: "success",
      statusCode: 200,
      message: `${Model?.name || "Data"} retrieved successfully`,
      data: rows,
      error: null,
      meta: {
        totalItems: count,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  } catch (error) {
    return {
      status: "error",
      statusCode: error.message.includes("Invalid") ? 400 : 500,
      message: `Failed to retrieve ${Model?.name || "data"}`,
      error: error.message,
      data: null,
      meta: null,
    };
  }
};

module.exports = buildQuery;
