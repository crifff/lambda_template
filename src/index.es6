import Main from "./main"

exports.handler = function (event, context) {
    (new Main).handler(event, context)
};
