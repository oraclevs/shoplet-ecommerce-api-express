import  { Request, } from 'express';
import request from 'request';
import useragent from 'useragent';

// Interface for login details
interface LoginDetails {
    dateTime: string;
    location: string;
    device: string;
}

// Function to get login details
export async function getLoginLocation(req: Request): Promise<LoginDetails> {
    return new Promise((resolve, reject) => {
        const dateTime = new Date().toISOString();
        const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '';
            
        const apiKey = process.env.IPSTACK_API_KEY
        const userAgentString = req.headers['user-agent'] as string;
        // Log User-Agent string
        

        const agent = useragent.parse(userAgentString);
        const geoApiUrl = `http://api.ipstack.com/${ip}?access_key=${apiKey}`

        

        request(geoApiUrl, (error: Error | null, response: request.Response, body: any) => {
            if (error) {
                reject('Error fetching location data');
                return;
            }

            if (response.statusCode === 200) {
                try {
                    const geoData = JSON.parse(body);
                    const location = `${geoData.city}, ${geoData.region}, ${geoData.country_name},${geoData.location.capital}`;
                    const device = agent.family !== 'Other'
                        ? `${agent.family} ${agent.major}.${agent.minor}.${agent.patch} / ${agent.os.family} ${agent.os.major}.${agent.os.minor}.${agent.os.patch}`
                        : userAgentString;
                    const loginInfo: LoginDetails = {
                        dateTime,
                        location,
                        device,
                    };

                    resolve(loginInfo);
                } catch (parseError) {
                    {
                        // if (parseError instanceof Error) {
                        //     console.error('Error parsing response:', parseError.message);
                        // } else {
                        //     console.error('Unknown error parsing response');
                        // }
                        reject('Error parsing location data');
                    }
                }
            } else {
                reject(`Error fetching location data: ${response.statusMessage}`);
            }
        });
    });
}




