const subscriptions = {};
var crypto = require("crypto");
const webpush = require("web-push");

const vapidKeys = {
    privateKey: "bdSiNzUhUP6piAxLH-tW88zfBlWWveIx0dAsDO66aVU",
    publicKey: "BIN2Jc5Vmkmy-S3AUrcMlpKxJpLeVRAfu9WBqUbJ70SJOCWGCGXKY-Xzyh7HDr6KbRDGYHjqZ06OcS3BjD7uAm8"
};

webpush.setVapidDetails("mailto:example@yourdomain.org", vapidKeys.publicKey, vapidKeys.privateKey);

function createHash(input) {
    const md5sum = crypto.createHash("md5");
    md5sum.update(Buffer.from(input));
    return md5sum.digest("hex");
}

function handlePushNotificationSubscription(req, res) {
    const subscriptionRequest = req.body;
    const susbscriptionId = createHash(JSON.stringify(subscriptionRequest));
    subscriptions[ susbscriptionId ] = subscriptionRequest;
    res.status(201).json({ id: susbscriptionId });
}

function sendPushNotification(req, res) {
    const subscriptionId = req.params.id;
    const title = req.query.title || "title";
    const text = req.query.text || "Notification";
    const tag = req.query.tag || "tag";
    const image = req.query.image || "/images/jason-leung-HM6TMmevbZQ-unsplash.jpg";
    const url = req.query.url || "/test";

    const message = JSON.stringify({
        title,
        text,
        image,
        tag,
        url
    });

    const pushSubscription = subscriptions[ subscriptionId ];
    webpush
        .sendNotification(
            pushSubscription,
            message
        )
        .catch(err => {
        console.log(err);
})
    ;

    res.status(202).json({});
}

module.exports = { handlePushNotificationSubscription, sendPushNotification };
