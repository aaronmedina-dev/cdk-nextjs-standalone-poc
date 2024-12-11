import { Stack, StackProps, Duration, CfnOutput } from 'aws-cdk-lib';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { Nextjs } from 'cdk-nextjs-standalone';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';

export class ServerlessNextjsPocStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const nextJsSite = new Nextjs(this, 'NextjsSite', {
            nextjsPath: './nextjs-app', // Path to the built Next.js app
        });

        //************* ADDED WARMER USING /.open-next/warmer-function *************//

        //create separate lambda function for the api api/hello.ts using NODE_18
        const apiFunction = new Function(this, 'ApiFunction', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'lambda.handler',
            code: Code.fromAsset('./dist'), // Need to compile lambda api first 
            functionName: 'lambda-api',
        });

        // Define the Warmer Lambda Function
        const openNextWarmerFunction = new Function(this, 'openNextWarmerFunction', {
            runtime: Runtime.NODEJS_18_X, // Use Node.js 18 runtime
            handler: 'index.handler', // Entry point for the warmer function
            code: Code.fromAsset('./nextjs-app/.open-next/warmer-function'), // Use the warmer-function folder
            timeout: Duration.seconds(30), // Set Lambda timeout
            environment: {
                FUNCTION_NAME: apiFunction.functionName, // Target server function name
                CONCURRENCY: '1', // Number of concurrent invocations
            },
        });

        // Grant invoke permission to the warmer function
        openNextWarmerFunction.addToRolePolicy(
            new PolicyStatement({
                actions: ['lambda:InvokeFunction'],
                resources: [apiFunction.functionArn], // Target server function ARN
            })
        );

        //************* ADDED WARMER USING CUSTOM WARMER FUNCTION *************//

        const customWarmer = new Function(this, 'CustomWarmerFunction', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'index.handler',
            code: Code.fromInline(`
                const https = require('https');

                exports.handler = async function() {
                const baseUrl = process.env.CLOUDFRONT_URL;  // Base Dynamic CloudFront URL from environment variables
                const paths = process.env.WARMER_PATHS.split(','); // Comma-separated paths from environment variables

                // Loop through each path and send a request to keep the corresponding Lambda warm
                for (const path of paths) {
                    const url = \`\${baseUrl}\${path}\`;  // Construct the full URL (CloudFront URL + path)

                    // Make an HTTPS GET request to the URL
                    await new Promise((resolve, reject) => {
                    https.get(url, (res) => {
                        // Log success response for each warmed endpoint
                        console.log(\`Warmed: \${url}, Status Code: \${res.statusCode}\`);
                        resolve(); // Resolve the promise on success
                    }).on('error', (err) => {
                        // Log error if the request fails
                        console.error(\`Error warming: \${url}, \`, err);
                        reject(err); // Reject the promise on error
                    });
                    });
                }
                };
                    
            `),
            timeout: Duration.seconds(30), // Set the Lambda timeout to 30 seconds
            environment: {
                CLOUDFRONT_URL: `https://${nextJsSite.distribution.distributionDomain}`, // Dynamic CloudFront domain name for the Next.js app
                WARMER_PATHS: '/api/hello', //You can add multiple paths here separated by comma
            },
        });



        // Schedule the warmer Lambda Function, added multiple warmer type targets to the rule
        new Rule(this, 'WarmerSchedule', {
            schedule: Schedule.rate(Duration.minutes(240)), // Run every X minutes
            targets: [new LambdaFunction(openNextWarmerFunction), new LambdaFunction(customWarmer)], // add multiple targets here
            
        });

    }
}
