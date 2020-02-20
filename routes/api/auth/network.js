const API_PATH = "/api";
const passport = require("passport");
const { success, error } = require("../../../network/response");
const { sigin } = require("./controller");
// Basic strategy
require("../../../utils/strategies/auth/basic");

module.exports = app => {
  app.post(`${API_PATH}/auth/sign-in`, async (req, res, next) => {
    try {
      passport.authenticate("basic", function(err, user) {
        if (err) {
          next(err);
          return;
        }
        req.login(user, { session: false }, async function(err) {
          if (err) {
            next(err);
            return;
          }
          const result = await sigin(user, next);

          success(res, result, 200);
        });
      })(req, res, next);
    } catch (error) {
      next(error);
    }
  });

  //   app.delete(`${API_PATH}/user/:id`, async (req, res) => {
  //     let id = req.params.id || null;

  //     const data = await deleteUser(id, req.file);

  //     if (data.error) {
  //       error(res, data.error, 500);
  //     } else {
  //       success(res, data, 200);
  //     }
  //   });
};
