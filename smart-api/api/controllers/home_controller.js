const schemas = require('../schemas/require_schemas');
const queries_packing = require('../helpers/queries/complex_queries_packing');
const _ = require('lodash');
const responses = require('../helpers/responses/index');

exports.getStats = async (req, res) => {
    const aggregate = await schemas.packing.aggregate(queries_packing.queries.home_stats());
    // const packingStats = {
    //     control_points: {
    //         quantityIncorrectLocal: aggregate[0].quantityIncorrectLocal,

    //     },
    //     traveling: aggregate[0].quantityTraveling + aggregate[0].quantityLate + aggregate[0].quantityMissing,
    //     no_signal: 0,
    //     packing_total: aggregate[0].quantityTotal
    // };
    res.json(aggregate[0]);
};

exports.getPackingsByStatus = (req, res) => {
    const params = {
        limit: parseInt(req.swagger.params.limit.value) || 10,
        page: parseInt(req.swagger.params.page.value) || 1,
        status: req.swagger.params.status.value,
    };

    schemas.packing
        .paginate({ status: params.status}, { limit: params.limit, page: params.page })
        .then(
            _.partial(
                responses.successHandlerPagination,
                res,
                req.user.refresh_token,
            )
        )
        .catch(
            _.partial(
                responses.errorHandler,
                res,
                'Error to list inventory permanence',
            )
        );
};