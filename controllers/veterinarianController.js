import Veterinarian from "../models/Veterinarian.js";
import generateJWT from "../helpers/generateJWT.js";
import generateToken from "../helpers/generateToken.js";
import emailRegister from "../helpers/emailRegister.js";
import emailForgotPassword from "../helpers/emailForgotPassword.js";

const register = async (req, res) => {
    const { email, name } = req.body;

    //avoid duplicates users
    const existUser = await Veterinarian.findOne({ email });

    if (existUser) {
        const error = new Error("The user already exists");
        return res.status(400).json({ msg: error.message });
    }
    try {
        //new veterinarian to DB
        const veterinarian = new Veterinarian(req.body);
        veterinarian.token = generateToken();
        const veterinarianSaved = await veterinarian.save();

        //send email to comfirm account
        emailRegister({
            name,
            email,
            token: veterinarianSaved.token,
        });


        res.json(veterinarianSaved);

    } catch (error) {
        console.log(error);
    }
};

const profile = (req, res) => {
    const { veterinarian } = req;

    res.json(veterinarian);
};


const userToken = async (req, res) => {
    const { token } = req.params;

    const userToken = await Veterinarian.findOne({ token });

    if (!userToken) {
        const error = new Error("Token invalid");
        return res.status(404).json({ msg: error.message })
    }

    try {
        userToken.token = null;
        userToken.authentication = true;
        await userToken.save();

        res.json({ msg: "User comfirmed correctly" });

    } catch (error) {
        console.log(error);
    }
}

const authenticate = async (req, res) => {
    const { email, password } = req.body;

    //check if user exists
    const user = await Veterinarian.findOne({ email });

    if (!user) {
        const error = new Error("The user does not exist");
        return res.status(403).json({ msg: error.message });
    }

    //check if user token is authenticated
    if (!user.authentication) {
        const error = new Error("Your account is not comfirmed yet");
        return res.status(403).json({ msg: error.message });

    }

    //check if password is correct
    if (! await user.checkPassword(password)) {
        const error = new Error("Your password is incorrect");
        return res.status(403).json({ msg: error.message });

    }

    //aunthenticate user
    res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateJWT(user.id),
        web: user.web,
        telNumber: user.web,
    });
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;


    const existVeterinarian = await Veterinarian.findOne({ email });

    if (!existVeterinarian) {
        const err = new Error("User does not exist");
        return res.status(404).json({ msg: err.message });
    }

    try {
        existVeterinarian.token = generateToken();
        await existVeterinarian.save();

        //send email to change password
        emailForgotPassword({
            email,
            name: existVeterinarian.name,
            token: existVeterinarian.token,
        });

        res.json({ msg: "We sent you an email to change your password" });

    } catch (error) {
        console.log(error);
    }
}

const checkPassToken = async (req, res) => {
    const { token } = req.params;

    const checkToken = await Veterinarian.findOne({ token });

    if (!checkToken) {
        const err = new Error("Token invalid");
        return res.status(403).json({ msg: err.message });
    }

    res.json({ msg: "Token is correct and user exists" });



}

const newPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const veterinarian = await Veterinarian.findOne({ token });

    if (!veterinarian) {
        const err = new Error("Unexpected error");
        return res.status(400).json({ msg: err.message });
    }

    try {
        veterinarian.token = null;
        veterinarian.password = password;
        await veterinarian.save();
        res.json({ msg: "Password has been restored correctly" });
    } catch (error) {
        console.log(error);
    }

}

const updateProfile = async (req, res) => {
    const veterinarian = await Veterinarian.findById(req.params.id);
    if (!veterinarian) {
        const error = new Error("Unexpected Error");
        return res.status(400).json({ msg: error.message });
    }

    const { email } = req.body;
    if (veterinarian.email !== req.body.email) {
        const existEmail = await Veterinarian.findOne({ email });
        if (existEmail) {
            const error = new Error("This email already exists");
            return res.status(400).json({ msg: error.message });
        }
    }
    try {
        veterinarian.name = req.body.name;
        veterinarian.email = req.body.email;
        veterinarian.telNumber = req.body.telNumber;
        veterinarian.web = req.body.web;

        const veterinarianUpdated = await veterinarian.save();
        res.json(veterinarianUpdated);
    } catch (error) {
        console.log(error);
    }
}

const updatePassword = async (req, res) => {
    const { id } = req.veterinarian;
    const { pwd_old, pwd_new } = req.body;

    //find veterinarian and check old password
    const veterinarian = await Veterinarian.findById(id);

    if(!veterinarian) {
        const error = new Error("Unexpected error");
        return res.status(400).json({msg: error.message});
    }

    if(!await veterinarian.checkPassword(pwd_old)) {
        const error = new Error("Your current password is incorrect");
        return res.status(400).json({msg: error.message});
    }

    //save new password
    veterinarian.password = pwd_new;
    await veterinarian.save();
    res.json({msg: "Your password has been updated correctly"});
}

export {
    register,
    profile,
    userToken,
    authenticate,
    forgotPassword,
    checkPassToken,
    newPassword,
    updateProfile,
    updatePassword,
}