const Mail = require('../models/mail')
module.exports.sendmail = async function (req, res) {
    try {
        var bodyInfo = req.body
        if (1) {
            var response = await new Mail().sendMail(email, data);
            res.send(response)
        } else {
            res.send({ "Success": true, "Error": error, "Payload": [] })
        }
    } catch (e) {
        res.send({ "Success": false, "Error": e.toString(), "Payload": [] });
    }
};

module.exports.receiveMail = async function (req, res) {
    try {
        if(1) {
            var response = await new Mail().ReceiveMail();
            res.send(response)
        }else {
            res.send({ "Success": true, "Error": error, "Payload": [] })
        }
    } catch (e) {
        res.send({ "Success": false, "Error": e.toString(), "Payload": [] });
    }
}