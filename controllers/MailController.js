const Mail = require('../models/mail')
module.exports.sendMail = async function (req, res) {
    try {
        var bodyInfo = req.body
        if (1) {
            var response = await new Mail().sendMail();
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
            //get username & password from database from here
            //& send using this array like this
            users = [
                ['email','password'],
                ['email','password'],
                ['email','password'],
                ['email','password'],
            ]
          
            users.map(async (udata)=> {
                var inbox = await new mailjs().receiveMail('Bulk Mail',udata[0],udata[1]);
                var spam = await new mailjs().receiveMail('INBOX',udata[0],udata[1]);
                res.send([inbox, spam])
            })
        }else {
            res.send({ "Success": true, "Error": error, "Payload": [] })
        }
    } catch (e) {
        res.send({ "Success": false, "Error": e.toString(), "Payload": [] });
    }
}