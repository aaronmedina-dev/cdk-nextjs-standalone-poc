import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Nextjs } from 'cdk-nextjs-standalone';

export class ServerlessNextjsPocStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        new Nextjs(this, 'NextjsSite', {
            nextjsPath: './nextjs-app', // Path to the built Next.js app
        });
    }
}
