exports.handler = async function (event, context) {
    try {
        const { id, downloadLocation } = event.queryStringParameters;

        switch (id) {
            case "image":
                const fetchImgUrl = `https://api.unsplash.com/photos/random?client_id=${process.env.ACCESS_KEY}`;
                const imgData = await fetch(fetchImgUrl).then((res) => res.json());

                return {
                    statusCode: 200,
                    body: JSON.stringify({ data: imgData })
                };

            case "download":
                if (downloadLocation) {
                    const downloadEventUrl = `${downloadLocation}?client_id=${process.env.ACCESS_KEY}`;
                    const returnData = await fetch(downloadEventUrl).then((res) => res.json());

                    return {
                        statusCode: 200,
                        body: JSON.stringify({ data: returnData })
                    }
                } else {
                    return {
                        statusCode: 404,
                        body: JSON.stringify({ error: "Missing download location" })
                    }
                }

            default:
                return {
                    statusCode: 404,
                    body: JSON.stringify({ error: "Invalid ID" })
                };
        }
    } catch (err) {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: err.toString() })
        };
    }
};