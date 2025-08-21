const asyncHandler = require("express-async-handler");
const ApiFeatures = require("./apiFeatures");
const ApiError = require("./apiError");

const deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (document) {
      return res.status(201).json({ Deleted: "Deleted" });
    }
    return next(new ApiError(`Not found Product for this : ${id}`, 404));
  });

const updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (document) {
      return res.status(201).json({ newDocument: document });
    }
    return next(new ApiError(`Not found document for this : ${id}`, 404));
  });

const createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const newDoc = await Model.create(req.body);
    return res.status(201).json({ Document: newDoc });
  });

const getOne = (Model, populateOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // Build query
    let query = Model.findById(id);
    if (populateOpt) {
      query = query.populate(populateOpt);
    }
    // excute query
    const docById = await query;
    if (docById) {
      return res.status(200).json({ Doc: docById });
    }
    return next(new ApiError(`Not found document for this id ${id}`, 404));
  });

const getAll = (Model, modelName = " ") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Building Query
    const documentsCount = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentsCount)
      .filter()
      .search(modelName)
      .limitFilds()
      .sort();

    // Execute Query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;
    return res.status(200).json({
      results: documents.length,
      paginationResult,
      data: documents,
    });
  });

module.exports = { deleteOne, updateOne, createOne, getOne, getAll };
