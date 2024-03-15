exports.setpassword= function(name,email,password){
    return new Promise(async(resolve,reject)=>{
        try {
            let template = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Template</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f4f4;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #fff;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: #333;
                        text-align: center;    

                        
                    }
                    p {
                        color: #666;
                        line-height: 1.6;
                    }
                    label{
                        color : red;
                    }
                    .email{
                        color : blue;
                    }
                   .name{
                    color :blue;
                   }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Your Password</h1>
                    <p>Dear <label class = name > ${name}</label>,</p>
                    <p>Your email <label class = email>${email}</label>,</p>
                    <p>Your password <label>${password}</label></p>
                    <p>Best regards,<br> The Team</p>
                </div>
            </body>
            </html>
            `
            resolve(template)
        } catch (error) {
            reject(error)
        }
    });
};