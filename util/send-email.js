const nodemailer = require('nodemailer');
exports.sendEmail = async function (emails,subject,content){
    return new Promise(async(resolve,reject)=>{
        try {
            if( typeof emails == "object") emails = emails.join(",");
            let transporter = nodemailer.createTransport({
                Host:sandbox.smtp.mailtrap.io,
                Port: 2525,
                secure : 2525 == 465 ? true :false ,
                auth:{
                    Username:d6f7f78d506072,
                    Password:c140997c5ffbf2,
                },

            });
            let info = await transporter.sendMail({
                from : '"HRM" <support@hrm.com',
                to :emails,
                subject :subject,
                html:content,
            });
            resolve(true);
        } catch (error) {
            reject(false);
        }
    });
};