const { Op } = require('sequelize');
const { body, validationResult } = require('express-validator');
const { generateToken } = require('../../helper/jwt');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const { checkHashText } = require('../../helper/bcrypt');
const InfoPengguna = require('../../database/models/info_pengguna');
const Roles = require('../../database/models/role');
const Encryption = require('../../helper/encription');
const dotenv = require('dotenv')

const validationLogin = [
    body('email').notEmpty().trim().withMessage('Email / NPWP / Username Kosong'),
    body('password').notEmpty().trim().withMessage('Password Kosong')
];

const getUserData = async(email) => {    
    return await InfoPengguna.findOne({
        where: {
            [Op.or]: [
                {email: email},
                {npwp: email},
                {username: email}
            ],
            isActive: true
        },
        include: {
            model: Roles,
            attributes: ['name']
        }
    })
}

const bundleLogin = (req, res, next) => {
    try {
        console.log(req.body)
        const Decrypt = Encryption.AESDecrypt(req.body.dataLogin);
        req.body = {
            ...Decrypt
        }
        // console.log(req.body);
        next()
    } catch (error) {
        console.log(error)
        return errorResponse(res, Http.badRequest, "Data Tidak Sesuai")
    }
}

const login = async(req, res) => {
    const validation = validationResult(req);
    if(!validation.isEmpty()){
        return errorResponse(res, Http.badRequest, validation.array()[0].msg);
    }

    try {
        // ambil User
        const resultLoginData = await getUserData(req.body.email);
        
        // cek user ada / tidak
        if(!resultLoginData){
            return errorResponse(res, Http.notFound, `Pengguna Dengan ${req.body.email} Tidak Ada`);
        }

        // convert ke josn
        const result = resultLoginData.toJSON();
 
        // cek password database dengan passwor yang diinput user
        if(checkHashText(result.password, req.body.password)){

            // jika role bukan user
            if(result.role.name !== 'User'){
                return errorResponse(res, Http.unauthenticated, "Login failed! Unauthorized Role");
            };

            // buat token
            const token = generateToken({email: result.email, user_id: result.id});

            // return json
            return res.status(Http.ok).json({
                success: true,
                message: 'Berhasil Login',
                data: token
            })
        }else{
            return errorResponse(res, Http.unauthenticated, "Gagal Login, cek username dan password")
        }
    } catch (error) {
        console.log('asd',error)
        return errorResponse(res, Http.internalServerError, "Login Failed, cek usernam dan password")
    }
}

// const forgotPassword = (req, res) => {
//     const user = await User.findOne({ email });

//     if (!user) {
//         throw new Error("User does not exist");
//     }
//     let token = await Token.findOne({ userId: user._id });
//     if (token) { 
//           await token.deleteOne()
//     };

    // // const {email} = req.body;

    // // infoPengguna.findOne({email}), (err, username) => {
    // //     if(err || !username) {
    // //         return res.status(400).json({error: "User With This Email Already Exists"})
    // //     }
        
    // //     const token = generateToken({_id: username._id}, process.env.RESET_PASSWORD_KEY);
    // //     return res.status(Http.ok).json({
    // //         success: true,
    // //         message: 'Berhasil Membuat Token Baru',
    // //         data: token
    // //     })

    // //     const data = {
    // //         from: 'noreply@hello.com',
    // //         to: email,
    // //         subject: "Account Activation Link",
    // //         html: <h2>Please click on given link to reset your password</h2>
    // //     }
    // } 
         
// }

module.exports = routes => {
    routes.post('/', bundleLogin, validationLogin, login)
}

