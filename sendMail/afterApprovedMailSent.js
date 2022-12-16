
var nodeoutlook = require('nodejs-nodemailer-outlook');

const afterApprovedMailSent = async (email, item) => {
    nodeoutlook.sendEmail({
        auth: {
            user: "test_osl@outlook.com",
            pass: "Test@111"
        },
        from: 'test_osl@outlook.com',
        to: email,
        subject: 'Approval mail',
        html: `
        <!doctype html>
        <html lang="en-US">
        
        <head>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <meta name="description" content="Reset Password Email Template.">
            <style type="text/css">
                a:hover {
                    text-decoration: underline !important;
                }
            </style>
        </head>
        
        <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #F2F3F8;" leftmargin="0">
            <!--100% body table-->
            <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#E71E25"
                style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700%7COpen+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                <tr>
                    <td style="background-color: #e4dddd;">
                        <table style="background-color: #e4dddd; max-width:670px;  margin:0 auto;" width="100%" border="0"
                            align="center" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="text-align:center; text-decoration: none; ">
        
                                    <h1 style="color:#2d2b2b;">DDFS-Procure to Pay
                                    </h1>
        
                                </td>
                            </tr>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td>
                                    <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                        style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:0 35px;">
                                                <h1
                                                    style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                                                   Your Request has been approved
                                                </h1>
        
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                    </table>
                                </td>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <!-- <td style="text-align:center;">
                                    <p
                                        style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">
                                        &copy; <strong>https://www.denso.com/in/en/</strong></p>
                                </td> -->
                            </tr>
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <!--/100% body table-->
        </body>
        
        </html>
        `,

        // `



        onError: (e) => console.log(e),
        onSuccess: (i) => console.log(i)
    }


    );
}

module.exports = afterApprovedMailSent;