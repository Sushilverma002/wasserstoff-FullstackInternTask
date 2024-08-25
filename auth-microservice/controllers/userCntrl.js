import userModel from "../models/user.js";
import mailer from "../utilites/mailer.js";
import apiResponseHandler from "../utilites/apiResponseHanlder.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import utilitesConfig from "../utilites/config.json" assert { type: "json" };
config();

const user = Object();

user.register = async (req, res) => {
  try {
    // step 1 : fetch user data
    const { name, email, password, role } = req.body;

    // step 2 : all fields required
    if (!name || !email || !password || !role) {
      return apiResponseHandler.sendError(
        403,
        false,
        "All fields are required.",
        function (response) {
          res.json(response);
        }
      );
    }

    // step 3 : check wheather user already exsist

    const isExisit = await userModel.findOne({ email });

    // step 4 : if user exsist, go for login

    if (isExisit) {
      return apiResponseHandler.sendError(
        400,
        false,
        "User already exisit, please login.",
        function (response) {
          res.json(response);
        }
      );
    }
    //step 5 password hashing
    const hashPassword = await bcrypt.hash(
      password,
      utilitesConfig.saltingRounds
    );
    const user = await userModel.create({
      name,
      email,
      password: hashPassword,
      role,
    });

    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    //token creation

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: utilitesConfig.expiresIn,
    });
    payload["token"] = token;
    user.token = token;
    user.password = undefined;

    // // step 6 : mail verfiy

    // const url = `http://localhost:${process.env.PORT}/api/v1/verfiyEmail/${token}`;
    // const verfiyMail = await mailer(
    //   email,
    //   "for verifiy email",
    //   `<a href="${url}">Verify your email</a>`
    // );

    apiResponseHandler.sendResponse(200, true, payload, function (response) {
      res.json(response);
    });
  } catch (error) {
    console.log(error);
    apiResponseHandler.sendError(
      500,
      false,
      "Something went wrong, internal sever error.",
      function (response) {
        res.json(response);
      }
    );
  }
};

user.verfiyMail = async (req, res) => {
  try {
    //step 1 : fetching id
    const { token } = req.params;

    if (!token) {
      apiResponseHandler.sendResponseMsg(
        403,
        false,
        "All fields are required, please try again.",
        function (response) {
          res.json(response);
        }
      );
    }
    // step 2 : just verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id);

    if (!user) {
      apiResponseHandler.sendResponseMsg(
        400,
        false,
        "Invalid token",
        function (response) {
          res.json(response);
        }
      );
    }
    //step 3 : mark is verified field as true
    user.isVerified = true;
    await user.save();

    apiResponseHandler.sendResponse(
      200,
      true,
      "Email verified successfully",
      function (response) {
        res.json(response);
      }
    );
  } catch (error) {
    console.log(error);
    apiResponseHandler.sendError(
      500,
      false,
      "Something went wrong, internal sever error.",
      function (response) {
        res.json(response);
      }
    );
  }
};

user.login = async (req, res) => {
  try {
    //step 1 : fetch data
    const { email, password } = req.body;

    //* data required
    if (!email || !password) {
      apiResponseHandler.sendResponse(
        403,
        false,
        "All fields are required, please try again.",
        function (response) {
          res.json(response);
        }
      );
    }

    //step 2 check wheather user exisit
    const user = await userModel.findOne({ email });

    // step 3: password matching
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
      };
      //step 4 : jwt token creation
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: utilitesConfig.expiresIn,
      });

      payload["token"] = token;
      user.password = undefined;

      // if (!user.isVerified) {
      //   return apiResponseHandler.sendError(
      //     400,
      //     payload,
      //     "email not verified",
      //     function (response) {
      //       res.json(response);
      //     }
      //   );
      // }

      apiResponseHandler.sendResponse(200, true, payload, function (response) {
        res.json(response);
      });
    } else {
      return apiResponseHandler.sendResponse(
        400,
        false,
        "password is incorrect.",
        function (response) {
          res.json(response);
        }
      );
    }
  } catch (error) {
    console.log(error);
    apiResponseHandler.sendError(
      500,
      false,
      "Something went wrong, internal sever error.",
      function (response) {
        res.json(response);
      }
    );
  }
};

user.update = async (req, res) => {
  try {
    //step 1: data update came in req body,wehre email and id is must
    const { id, email } = req.body;

    if (!id || !email) {
      return apiResponseHandler.sendError(
        404,
        false,
        "id and email is required",
        (response) => {
          res.json(response);
        }
      );
    }
    //step2: as user updating there deatils mean it already registerd, but will check using id

    const isExisit = await userModel.findById(id);

    if (!isExisit) {
      return apiResponseHandler.sendError(
        400,
        false,
        "User not exist",
        (response) => {
          res.json(response);
        }
      );
    }

    // user may udpate there password hence we have to hash that
    if (req.body.password) {
      req.body.password = await bcrypt.hash(
        req.body.password,
        utilitesConfig.saltingRounds
      );
    }

    //step 3: will update there data in the db
    const updateDeatils = await userModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    //step 4: return reponse data udpated successfully
    if (updateDeatils) {
      delete updateDeatils._doc.password;
      return apiResponseHandler.sendResponse(
        200,
        true,
        updateDeatils,
        (response) => {
          res.json(response);
        }
      );
    } else {
      apiResponseHandler.sendResponse(
        400,
        false,
        "Something went wrong, details are not updated",
        (response) => {
          res.json(response);
        }
      );
    }
  } catch (error) {
    console.log("Error occured:", error);
    apiResponseHandler.sendError(
      500,
      false,
      "Something went wrong, Internal sever error.",
      function (response) {
        res.json(response);
      }
    );
  }
};

user.delete = async (req, res) => {
  try {
    //step 1 taking id in the req. body
    const { id } = req.body;

    //step 2 vaildate and delete the user
    const deleteUser = await userModel.findByIdAndDelete(id);

    //step 3 sending response as user delete successfully
    if (deleteUser) {
      return apiResponseHandler.sendResponse(
        200,
        true,
        "User deleted successfully",
        (response) => {
          res.json(response);
        }
      );
    } else {
      apiResponseHandler.sendResponse(
        400,
        false,
        "Something went wrong, User not deleted",
        (response) => {
          res.json(response);
        }
      );
    }
  } catch (error) {
    console.log("Error occured:", error);
    apiResponseHandler.sendError(
      500,
      false,
      "Something went wrong, Internal server error",
      (response) => {
        res.json(response);
      }
    );
  }
};

user.getUserData = async (req, res) => {
  try {
    //step 1: making a db call for get all user
    const allUser = await userModel.find({});
    //step 2: send data in the response
    if (allUser) {
      apiResponseHandler.sendResponse(200, true, allUser, (response) => {
        res.json(response);
      });
    } else {
      apiResponseHandler.sendError(
        400,
        false,
        "Something went wrong, Users not fetched",
        (response) => {
          res.json(response);
        }
      );
    }
  } catch (error) {
    apiResponseHandler.sendResponseMsg(
      500,
      false,
      "Something went wrong, Internal server error",
      (response) => {
        res.json(response);
      }
    );
  }
};

user.vaildateToken = async (req, res) => {
  console.log("-------vaildate toke api hit-----------------");

  try {
    const { id } = req.user;
    const userDetails = await userModel.findById(id);
    //step 2: send data in the response
    if (userDetails) {
      apiResponseHandler.sendResponse(200, true, userDetails, (response) => {
        res.json(response);
      });
    } else {
      apiResponseHandler.sendError(
        400,
        false,
        "Something went wrong, Users not fetched",
        (response) => {
          res.json(response);
        }
      );
    }
  } catch (error) {
    apiResponseHandler.sendResponseMsg(
      500,
      false,
      "Something went wrong, Internal server error",
      (response) => {
        res.json(response);
      }
    );
  }
};
export default user;
