/**
 * @description List of errors for bandwidth-errors tool, defined as an object with a name and an array of errors.
 * @typedef {Object} Error
 * @property {string} code
 * @property {string} description
 * @property {string} friendlyDescription
 * @property {string} explanationOfError
 */
export const errorList = {
    "Bandwidth Detected Client Errors": {
        "name": "Bandwidth Detected Client Errors",
        "errors": [
            {
                "code": "4001",
                "description": "service-not-allowed",
                "friendlyDescription": "Message was rejected for reasons other than those covered by other 4xxx codes",
                "explanationOfError": "This is a general error that the service you are attempting to use is not allowed; you may have inaccurate permissions, formatting or may not be enable to use that service."
            },
            {
                "code": "4301",
                "description": "malformed-invalid-encoding",
                "friendlyDescription": "Malformed message encoding",
                "explanationOfError": "The message contains invalid characters that are not supported. Bandwidth cannot re-encode message for destination."
            },
            {
                "code": "4302",
                "description": "malformed-invalid-from-number",
                "friendlyDescription": "Malformed From number",
                "explanationOfError": "The From number associated with the message is a number not routable to a carrier or valid in the industry (Ex: a 9 digit number)."
            },
            {
                "code": "4303",
                "description": "malformed-invalid-to-number",
                "friendlyDescription": "Malformed To Number",
                "explanationOfError": "The To number associated with the message is a number not routable to a carrier or valid in the industry (Ex: a 9 digit number)."
            },
            {
                "code": "4350",
                "description": "malformed-for-destination",
                "friendlyDescription": "Malformed message encoding",
                "explanationOfError": "Message passed validation on receive stage, but failed on send. This is likely because the destination number (To) is an invalid number."
            },
            {
                "code": "4360",
                "description": "message-not-sent-expiration-date-passed",
                "friendlyDescription": "Message expired",
                "explanationOfError": "Message was not sent because the specified expiration date passed before the message was able to send"
            },
            {
                "code": "4401",
                "description": "rejected-routing-error",
                "friendlyDescription": "BW is unable to route the message",
                "explanationOfError": "Message is unable to be routed within Bandwidth particularly when the source and destination are the same number. The destination or To number is mis-provisioned or there is a configuration with the message that is causing a situation where a message is being sent repeatedly between the same numbers."
            },
            {
                "code": "4403",
                "description": "rejected-forbidden-from-number",
                "friendlyDescription": "Messaging forbidden on From number",
                "explanationOfError": "Messaging on this From number is forbidden most commonly because the number does not belong to BW or the account. Other reasons include: the TN is not enabled in the Bandwidth Dashboard, the account associated with this number is not enabled for this type of messaging, the TN is disconnected, or it is an invalid number (i.e., 11111111111)."
            },
            {
                "code": "4404",
                "description": "rejected-forbidden-to-number",
                "friendlyDescription": "Messaging forbidden on To number",
                "explanationOfError": "Messaging to this To number is forbidden. This could be that the destination number is not active, not enabled for messaging, or is an invalid number (i.e. 11111111111). It may also mean one or more of the recipients in a group message is not valid(i.e. one of the recipients is a TFN orSC)."
            },
            {
                "code": "4405",
                "description": "rejected-unallocated-from-number",
                "friendlyDescription": "Unallocated from number",
                "explanationOfError": "The From telephone number is considered unallocated when the number does not exist in our database as an active number. This number is either not enabled for messaging at the industry level, or the number is not yet released in the industry"
            },
            {
                "code": "4406",
                "description": "rejected-unallocated-to-number",
                "friendlyDescription": "Unallocated to number",
                "explanationOfError": "The To number associated with this message, while a valid North American number, is not yet assigned to a carrier and the message cannot be sent downstream."
            },
            {
                "code": "4407",
                "description": "rejected-account-not-defined-from-number",
                "friendlyDescription": "From Number is associated with account",
                "explanationOfError": "Undefined source account id. The From number associated with this message is not associated with this account, is an invalid number or not configured appropriately to send messages."
            },
            {
                "code": "4408",
                "description": "rejected-account-not-defined-to-number",
                "friendlyDescription": "To Number not associated with account",
                "explanationOfError": "Undefined destination account id. The To (destination) number is not associated with an account, is an invalid number or not configured correctly to receive messages."
            },
            {
                "code": "4409",
                "description": "rejected-invalid-from-profile",
                "friendlyDescription": "Invalid destination profile",
                "explanationOfError": "Bandwidth failed to create destination. The destination profile is considered invalid, most often this is because the destination number does not support MMS."
            },
            {
                "code": "4410",
                "description": "media-unavailable",
                "friendlyDescription": "Could not download media",
                "explanationOfError": "There was an error retrieving the media from the media web server. Check the media URL and try to access directly to see if the media can be fetched successfully."
            },
            {
                "code": "4411",
                "description": "rejected-message-size-limit-exceeded",
                "friendlyDescription": "Combined size of media too large",
                "explanationOfError": "The total size of MMS message media/attachments exceeded the max file size supported"
            },
            {
                "code": "4412",
                "description": "media-content-invalid",
                "friendlyDescription": "Failed to parse Content-Type for media",
                "explanationOfError": "The media content type is not a supported media content type."
            },
            {
                "code": "4420",
                "description": "rejected-carrier-does-not-exist",
                "friendlyDescription": "No Route to Destination Carrier",
                "explanationOfError": "The upstream carrier associated with the message does not exist in Bandwidth configuration"
            },
            {
                "code": "4421",
                "description": "rejected-forbidden-no-destination",
                "friendlyDescription": "No Route to Destination Carrier",
                "explanationOfError": "The message cannot be sent downstream as the account associated with the message does not have permission to send to this destination. You may not be provisioned to send to this destination."
            },
            {
                "code": "4431",
                "description": "rejected-forbidden-shortcode",
                "friendlyDescription": "Messaging on shortcode forbidden",
                "explanationOfError": "The message cannot be sent as the account associated with the message is not provisioned for Short code messaging"
            },
            {
                "code": "4432",
                "description": "rejected-forbidden-country",
                "friendlyDescription": "Messaging to country forbidden",
                "explanationOfError": "Bandwidth system indicates the account associated with the message is not enabled for messaging this zone, this country or this country is outside of messaging reach (specifically for MMS)."
            },
            {
                "code": "4433",
                "description": "rejected-forbidden-tollfree",
                "friendlyDescription": "Messaging on Toll Free Number Forbidden",
                "explanationOfError": "The account associated with this message is not enabled for toll free messaging"
            },
            {
                "code": "4434",
                "description": "rejected-forbidden-tollfree-for-recipient",
                "friendlyDescription": "Messaging to Toll Free Number Forbidden",
                "explanationOfError": "Messaging to this toll free number is not allowed. Number is likely not enabled for messaging or not active."
            },
            {
                "code": "4435",
                "description": "forbidden-too-many-recipients",
                "friendlyDescription": "Too Many Recipients",
                "explanationOfError": "The group message has too many recipients. When sending Group Messages, there's a maximum of 10 participants in a Group."
            },
            {
                "code": "4451",
                "description": "rejected-wrong-user-id",
                "friendlyDescription": "Invalid User Id",
                "explanationOfError": "The user id is not a valid id. Verify the user ID and retry the message"
            },
            {
                "code": "4452",
                "description": "rejected-wrong-application-id",
                "friendlyDescription": "Invalid Application ID",
                "explanationOfError": "The Application ID specified is not a valid Application Id, or the Application ID is not associated with the account"
            },
            {
                "code": "4470",
                "description": "rejected-spam-detected",
                "friendlyDescription": "Rejected as SPAM",
                "explanationOfError": "This message has been filtered and blocked by Bandwidth for spam. Messages can be blocked for a variety of reason, including but not limited to volumetric filtering, content blocking, SHAFT violation, etc."
            },
            {
                "code": "4481",
                "description": "rejected-from-number-in-blacklist",
                "friendlyDescription": "From Number in black list",
                "explanationOfError": "The From number has been flagged by Bandwidth as prohibited from sending messages. This is typically because Bandwidth or a downstream carriers has several violations; reports of spam, P2P violations, associated with this number."
            },
            {
                "code": "4482",
                "description": "rejected-to-number-in-blacklist",
                "friendlyDescription": "To Number in black list",
                "explanationOfError": "The number you are attempting to send to is blocked from receiving messages."
            },
            {
                "code": "4492",
                "description": "reject-emergency",
                "friendlyDescription": "Message to emergency number forbidden",
                "explanationOfError": "Messaging to an emergency number is forbidden"
            },
            {
                "code": "4493",
                "description": "rejected-unauthorized",
                "friendlyDescription": "Unauthorized",
                "explanationOfError": "Bandwidth service indicates the sender is not authorized to send messages from the account."
            }
        ]
    },
    "Carrier Reported Client Errors": {
        "name": "Carrier Reported Client Errors",
        "errors": [
            {
                "code": "4700",
                "description": "invalid-service-type",
                "friendlyDescription": "Carrier Rejected as Invalid Service Type",
                "explanationOfError": "Carrier rejected message for invalid service type. This usually means messaging (SMS or MMS) is not supported by the carrier or handset."
            },
            {
                "code": "4701", 
                "description": "destination-service-unavailable",
                "friendlyDescription": "Destination is not reachable and SMS service is not available.",
                "explanationOfError": "Carrier service is reporting the destination is not reachable or the SMS service is not available."
            },
            {
                "code": "4702",
                "description": "destination-subscriber-unavailable", 
                "friendlyDescription": "Destination subscriber is unavailable.",
                "explanationOfError": "This error indicates the subscriber is unavailable. There are several reasons for this; the subscriber has turned off handset, the destination is unreachable or barred, the GSM subscriber is busy for outbound SMS, SIM card is full, voicemail is full, or cannot reach the destination handset and has stored the message for retry in its « Store & Forward » function."
            },
            {
                "code": "4711",
                "description": "rejected-message-size-limit-exceeded",
                "friendlyDescription": "Media size too large",
                "explanationOfError": "Downstream vendor cannot retrieve the media as the MMS attachment is too large"
            },
            {
                "code": "4712",
                "description": "media-content-invalid",
                "friendlyDescription": "The media content type is not supported",
                "explanationOfError": "The media content type is not supported. Please review the accepted media types here."
            },
            {
                "code": "4720",
                "description": "invalid-destination-address",
                "friendlyDescription": "Carrier Rejected as Invalid Destination Address",
                "explanationOfError": "Carrier Rejected as Invalid Destination Address. This could mean the number is not in the numbering plan (area code does not exist or the number is just invalid) or the number is not enabled for messaging (like a landline). Additionally, for toll free messages to TMobile, this could also mean the user has opted to block all toll free and short code traffic"
            },
            {
                "code": "4721",
                "description": "destination-tn-deactivated",
                "friendlyDescription": "TN on deactivation list",
                "explanationOfError": "The phone number you are attempting to send to is on the deactivation list. It is not associated with a carrier to be able to receive messages or is inactive."
            },
            {
                "code": "4730",
                "description": "no-route-to-destination-carrier",
                "friendlyDescription": "No route to destination carrier or no roaming route exists.",
                "explanationOfError": "Carrier is reporting there is no route available for message. This could be because no routing exists to destination, no roaming route is available, the destination handset is roaming on a network that cannot be reached, no SS7 route, or routing was denied"
            },
            {
                "code": "4740",
                "description": "invalid-source-address-address",
                "friendlyDescription": "Carrier Rejected as Invalid Source Address",
                "explanationOfError": "Carrier is rejecting the message due to invalid source address - the number does not exist in the numbering plan. Other reasons for this error code is the source carrier is invalid or disabled or source not authorized or the number type is not supported."
            },
            {
                "code": "4750",
                "description": "destination-rejected-message",
                "friendlyDescription": "Carrier Rejected Message",
                "explanationOfError": "The destination carrier has rejected the message but provided no specific reason. For AT&T traffic, this could be a prepaid user whose account is out of money, a subscriber that is provisioned to not receive this type of SMS or it was identified as Spam"
            },
            {
                "code": "4751",
                "description": "destination-rejected-message-size-invalid",
                "friendlyDescription": "Message is too long or message length is invalid for the carrier.",
                "explanationOfError": "Carrier has rejected for message length is invalid or too long."
            },
            {
                "code": "4752",
                "description": "destination-rejected-malformed",
                "friendlyDescription": "Message is malformed for the carrier.",
                "explanationOfError": "Carrier is rejecting the message malformed; this could be because of a blank message, unacceptable data value, the receiving SMSC or SME does not accept messages with more than 160 characters, syntax error, content is invalid, message ID is invalid, invalid parameter length, expected TLV missing, invalid TLV value, invalid data coding scheme, invalid number of destinations, error in the optional part of the PDU body, TLV not allowed, or XML validation error."
            },
            {
                "code": "4753",
                "description": "destination-rejected-handset",
                "friendlyDescription": "The destination handset has rejected the message",
                "explanationOfError": "The handset has rejected the message"
            },
            {
                "code": "4770",
                "description": "destination-spam-detected",
                "friendlyDescription": "Carrier Rejected as SPAM",
                "explanationOfError": "The Carrier is reporting this message as blocked for SPAM. Spam blocks could be a result of content, SHAFT violations (including specific keywords), originating address has been flagged for repeated spam content"
            },
            {
                "code": "4771",
                "description": "rejected-shortened-url",
                "friendlyDescription": "Rejected due to shortened url",
                "explanationOfError": "There was an error with the shortened URL used. Bandwidth recommends customers obtain their own dedicated domain if shortened links are needed for their messaging campaign."
            },
            {
                "code": "4772",
                "description": "rejected-tn-blocked",
                "friendlyDescription": "Blocked sender or receiver",
                "explanationOfError": "This error indicates a blocked Sender or Receiver on the downstream platform. Please reach out to Bandwidth support so we can engage our vendor to determine which telephone number is blocked and why."
            },
            {
                "code": "4773",
                "description": "inactive-campaign",
                "friendlyDescription": "Campaign inactive for destination",
                "explanationOfError": "The campaign this TN is assigned to is not active for the destination. Please check the status with TCR (The Campaign Registry). You will receive this error if the campaign is pending or rejected by the DCA or suspended by an MNO but the TN is still assigned to the campaign."
            },
            {
                "code": "4774",
                "description": "provisioning-issue",
                "friendlyDescription": "Issue with TN provisioning in industry database",
                "explanationOfError": "There is an issue with how the number is provisioned in the industry's database. There may be some components of 10DLC provisioning that are incorrect or missing. Please reach out to Bandwidth support to investigate and correct this issue."
            },
            {
                "code": "4775",
                "description": "destination-rejected-due-to-user-opt-out",
                "friendlyDescription": "Carrier Rejected due to user opt out",
                "explanationOfError": "User has opted out of receiving messages from a particular sender. Remove the destination TN from subscriber list and cease communication with the destination."
            },
            {
                "code": "4780",
                "description": "volume-violation-tmo",
                "friendlyDescription": "T-Mobile rejected due to volumetric violation",
                "explanationOfError": "T-Mobile rejected due to volumetric violation. You have sent over the daily limit for your 10DLC Brand. Please review your Brand daily throughput limit to ensure you are not exceeding the approved volumes. To improve your Brand score please see our article on external vetting Brand Vetting."
            },
            {
                "code": "4781",
                "description": "volume-violation-att",
                "friendlyDescription": "AT&T rejected due to 10DLC volumetric violation or throttling",
                "explanationOfError": "AT&T rejected due to volumetric violation. You have sent over the rate limit for your 10DLC campaign. Please review your campaign throughput limit to ensure you are not exceeding the approved volumes. This error can also indicate throttling by AT&T for other reasons, including high spam rates."
            },
            {
                "code": "4785",
                "description": "volumetric-violation",
                "friendlyDescription": "Carrier rejected due to volumetric violation",
                "explanationOfError": "The carrier rejected the message due to a volumetric violation. You have sent over the allotted limit and need to back off sending. Please retry after some time."
            },
            {
                "code": "4790",
                "description": "destination-rejected-sc-not-allowed",
                "friendlyDescription": "Carrier Rejected Due to Short Code Restriction",
                "explanationOfError": "Carrier Rejected Due to Short Code Restriction. Destination address blocked by mobile operator, destination cannot receive short code messages, or the mobile operator blocked the destination from receiving messages from this short code for some other reason."
            },
            {
                "code": "4791",
                "description": "destination-rejected-campaign-not-allowed",
                "friendlyDescription": "Carrier Rejected Short Code Campaign Not Allowed",
                "explanationOfError": "Carrier Rejected SC Campaign Not Allowed or blocked by the mobile operator"
            },
            {
                "code": "4792",
                "description": "destination-rejected-sc-not-provisioned",
                "friendlyDescription": "Carrier Rejected Short Code Not Provisioned",
                "explanationOfError": "Short Code not provisioned on mobile operator's network."
            },
            {
                "code": "4793",
                "description": "destination-rejected-sc-expired",
                "friendlyDescription": "Carrier Rejected Short Code Expired",
                "explanationOfError": "Short Code expired with the mobile operator"
            },
            {
                "code": "4795",
                "description": "tfn-not-verified",
                "friendlyDescription": "Toll Free number is not verified",
                "explanationOfError": "The message was blocked due to the toll free number not being verified. This can also be because there is SPAM on the unverified TFN. Please review unverified sending limits and submit TFN for verification as soon as possible."
            }
        ]
    },
    "Bandwidth Service Errors": {
        "name": "Bandwidth Service Errors",
        "errors": [
            {
                "code": "5100",
                "description": "temporary-app-error",
                "friendlyDescription": "Application Error",
                "explanationOfError": "An application within the Bandwidth service is experiencing a temporary error that is preventing the message from being processed."
            },
            {
                "code": "5101",
                "description": "temporary-app-shutdown",
                "friendlyDescription": "Application Error",
                "explanationOfError": "App going down. Message not received. Sender should send this messages later or to other host."
            },
            {
                "code": "5106",
                "description": "impossible-to-route",
                "friendlyDescription": "Impossible to route",
                "explanationOfError": "Impossible to route / Attempt to deliver through retries has failed."
            },
            {
                "code": "5111",
                "description": "temporary-app-connection-closed",
                "friendlyDescription": "Application Error",
                "explanationOfError": "Received messaged for connection which is already removed."
            },
            {
                "code": "5201",
                "description": "temporary-rout-error-retries-exceeded",
                "friendlyDescription": "Application Error",
                "explanationOfError": "Bandwidth service expired the message after attempts to deliver through retries failed."
            },
            {
                "code": "5211",
                "description": "temporary-app-error-app-busy",
                "friendlyDescription": "Application Error",
                "explanationOfError": "Bandwidth service application is temporarily busy so it cannot receive messages at this time"
            },
            {
                "code": "5220",
                "description": "temporary-store-error",
                "friendlyDescription": "Application Error",
                "explanationOfError": "Message not received. Cannot save message to store."
            },
            {
                "code": "5231",
                "description": "discarded-concatenation-timeout",
                "friendlyDescription": "Application Error",
                "explanationOfError": "Bandwidth did not receive all parts of message. Message can not be sent."
            },
            {
                "code": "5500",
                "description": "message-send-failed",
                "friendlyDescription": "General Message Send Failure",
                "explanationOfError": "The destination carrier has reported a general service failure with sending the message."
            },
            {
                "code": "5501",
                "description": "message-send-failed",
                "friendlyDescription": "General Message Send Failure",
                "explanationOfError": "The message is unable to send as no destination is available."
            },
            {
                "code": "5999",
                "description": "unknown-error",
                "friendlyDescription": "Unknown error from Bandwidth",
                "explanationOfError": "Unknown error generated by Bandwidth when Bandwidth core reports an unknown error"
            }
        ]
    },
    "Carrier Reported Service Failures": {
        "name": "Carrier Reported Service Failures",
        "errors": [
            {
                "code": "5600",
                "description": "destination-carrier-queue-full",
                "friendlyDescription": "Carrier Service Unavailable",
                "explanationOfError": "Carrier Service Unavailable. This could result from network congestion, messaging queue full on the vendor side, throttling error on the vendor side."
            },
            {
                "code": "5610",
                "description": "submit* sm-or-submit* multi-failed",
                "friendlyDescription": "Carrier Service Failure",
                "explanationOfError": "The downstream carrier application is experiencing an error. submitting the message has failed or cancelling message has failed"
            },
            {
                "code": "5620",
                "description": "destination-app-error",
                "friendlyDescription": "Carrier Application Error",
                "explanationOfError": "The carrier is reporting a general error associated with their application processing the message."
            },
            {
                "code": "5630",
                "description": "message-not-acknowledged",
                "friendlyDescription": "Carrier Application Error",
                "explanationOfError": "NACK - no response or acknowledgement received from the carrier"
            },
            {
                "code": "5650",
                "description": "destination-failed",
                "friendlyDescription": "Carrier Service Failure",
                "explanationOfError": "Carrier Service is reporting a failure to send to destination (mobile operator or handset)."
            }
        ]
    },
    "Carrier Errors with Ambiguous Cause": {
        "name": "Carrier Errors with Ambiguous Cause",
        "errors": [
            {
                "code": "9902",
                "description": "delivery-receipt-expired",
                "friendlyDescription": "Timed out waiting for delivery receipt. The reason a delivery receipt was not received is not known.",
                "explanationOfError": "Bandwidth timed out waiting for the delivery receipt, this could be because the downstream provider did not send the requested delivery receipt or they sent after the system timed out at two hours."
            },
            {
                "code": "9999",
                "description": "unknown-error",
                "friendlyDescription": "Unknown error from downstream. Carrier reported a failure code that is unknown to Bandwidth.",
                "explanationOfError": "Bandwidth does not recognize the vendor's error response or does not have the vendor code mapped internally"
            }
        ]
    }
}