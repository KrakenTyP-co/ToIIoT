FORMAT: 1A
HOST: http://polls.apiblueprint.org/

# TolloT API Documentation

API Docs...

## Toilets Collection [/wc]

### List WCs [GET /wc{?cateogry}]

List of toilets. Header is optional.

+ Parameters

    + category: "2oucniwjni" (optional, string) - Filter by category id

+ Request

    + Headers

            X-Auth-Token: JCAiSjGefNprusgyRmtN51_CoQUutKOa9cPBu18kDCI


+ Response 200 (application/json)

    + Body

            {
                "status": "success",
                "data": [
                        {
                            "_id":"2ud92939dj203j0d2j923jd",
                            "categoryId": "982j9f8h2983fh98",
                            "status": true,
                            "active": true,
                            "token": "28f9j394hf87hh4f",
                            "banner": "http://someurl.com/banner.jpg"
                        }
                ]
            }

### Get WC state [GET /wc/{_id}]

Get toilate state. Header is optional.

+ Parameters

    + _id: "2oucniwjni" (optional, string) - Toilet id

+ Request

    + Headers

            X-Auth-Token: JCAiSjGefNprusgyRmtN51_CoQUutKOa9cPBu18kDCI


+ Response 200 (application/json)

    + Body

            {
                "status": "success",
                "data": {
                        "_id":"2ud92939dj203j0d2j923jd",
                        "categoryId": "982j9f8h2983fh98",
                        "status": true,
                        "active": true,
                        "token": "28f9j394hf87hh4f",
                        "banner": "http://someurl.com/banner.jpg"
                    }

            }

+ Response 404 (application/json)

    + Body

            {
                "status": "error",
                "message": "WC not found"
            }


### Subscribe to WC state [POST /wc/{_id}/subsribe]

Subscribe user mobile to WC. If header with wc token is set it mean manager is subscribing to alerts.
Header is optional.

+ Parameters

    + _id: "2oucniwjni" (optional, string) - Toilet ID


+ Request (application/json)


    + Headers

            X-Auth-Token: JCAiSjGefNprusgyRmtN51_CoQUutKOa9cPBu18kDCI


    + Body

            {
                "deviceToken": "wd8278hd72hduh23du2h3d8i2uh3d2u"
            }

+ Response 200 (application/json)


    + Body

            {
               "status": "success"
            }



### Unsubscribe to WC state [POST /wc/{_id}/unsubsribe]


Unsubscribe user mobile from WC. If header with wc token is set it mean manager is subscribing to alerts.
Header is optional.


+ Parameters

    + _id: "2oucniwjni" (optional, string) - Toilet ID


+ Request (application/json)


    + Headers

            X-Auth-Token: JCAiSjGefNprusgyRmtN51_CoQUutKOa9cPBu18kDCI

    + Body


            {
                "deviceToken": "wd8278hd72hduh23du2h3d8i2uh3d2u"
            }

+ Response 200 (application/json)

    + Body

            {
               "status": "success"
            }


### Update WC  [PUT /wc/{_id}]

Update WC Setttings. Header is required.

+ Request (application/json)


    + Headers

            X-Auth-Token: JCAiSjGefNprusgyRmtN51_CoQUutKOa9cPBu18kDCI

    + Body

            {
                "banner": "http://someurl.com/banner.jpg"
            }

+ Response 200 (application/json)

    + Body

            {
               "status": "success",
               "data": {
                    "categoryId": "982j9f8h2983fh98",
                    "status": true,
                    "active": true,
                    "token": "28f9j394hf87hh4f",
                    "banner": "http://someurl.com/banner.jpg"
                }
            }




## Categories Collection [/categories]

### Get categories [GET /categories]


+ Response 200 (application/json)


            {
                "status": "success",
                "data": [
                    {
                        "_id": "98hf92h7387f4873gf87g"
                        "title": "Kosice"
                    }
                ]
            }

