import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css'; // Styling for the page

const Home: React.FC = () => {
    const [apiParam, setApiParam] = useState(''); // State to store the parameter
    const router = useRouter(); // Hook for programmatic navigation

    // Function to redirect to the API route with the correct query parameter
    const handleRedirect = () => {
        if (apiParam.trim()) {
            // Redirect to /api/hello?name=<parameter>
            router.push(`/api/hello?name=${encodeURIComponent(apiParam)}`);
        }
    };


    const [staticData, setStaticData] = useState<{ title: string; description: string } | null>(null);

    useEffect(() => {
        // Fetch the static JSON file
        fetch('/static/data.json')
            .then((response) => response.json())
            .then((data) => setStaticData(data));
    }, []);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                {/* Consumtption of static data */}
                <h1>{staticData?.title || 'Loading...'}</h1>
                <p>{staticData?.description || 'Fetching static data...'}</p>
                <p>Title and Description loaded from data.json</p>
            </header>

            <main className={styles.main}>
                {/* Image Optimization Example */}
                <section className={styles.imageComparison}>
                    <h2>Image Optimisation Example</h2>
                    <p>
                        Below is an example of Next.js image optimisation: the same image
                        rendered at <strong>different quality levels</strong>.
                    </p>
                    <div className={styles.imageContainer}>
                        <div>
                            <Image
                                src="/test-image.jpg"
                                alt="Optimisedd Image (Quality: 1)"
                                width={500}
                                quality={1}
                                className={styles.image}
                            />
                            <p>Width:500 Quality: 1</p>
                        </div>
                        <div>
                            <Image
                                src="/test-image.jpg"
                                alt="Optimisedd Image (Quality: 100)"
                                width={500}
                                quality={100}
                                className={styles.image}
                            />
                            <p>Width:500 Quality: 100</p>
                        </div>
                    </div>
                    <br />
                    <div className={styles.imageContainer}>
                        <div>
                            <Image
                                src="/test-image.jpg"
                                alt="Optimisedd Image (Quality: 1)"
                                width={256}
                                quality={1}
                                className={styles.image}
                            />
                            <p>Width:256 Quality: 1</p>
                        </div>
                        <div>
                            <Image
                                src="/test-image.jpg"
                                alt="Optimisedd Image (Quality: 100)"
                                width={256}
                                quality={100}
                                className={styles.image}
                            />
                            <p>Width:256 Quality: 100</p>
                        </div>
                    </div>
                </section>

                {/* Explore More Links */}
                <section className={styles.links}>
                    <br />
                    <h2>Explore More</h2>
                    <p>
                        <Link href="/ssr" className={styles.link}>
                            Server-Side Rendering (SSR) page demo.
                        </Link>
                    </p>
                    <br />
                    <p>
                        <Link href="/dynamic/example" className={styles.link}>
                            Dynamic route with slug:<strong>example</strong> demo.
                        </Link>
                    </p>
                    <br />
                    <p>
                        {/* Textbox and button for API parameter */}
                        <label htmlFor="apiParam" className={styles.label}>
                            API Demo. Enter a parameter to test API route:
                        </label>
                        <input
                            type="text"
                            id="apiParam"
                            className={styles.input}
                            value={apiParam}
                            onChange={(e) => setApiParam(e.target.value)}
                            placeholder="Enter Name"
                        />
                        <button
                            className={styles.button}
                            onClick={handleRedirect}
                            disabled={!apiParam.trim()}
                        >
                            Go to API Page
                        </button>
                    </p>
                </section>
            </main>

            <footer className={styles.footer}>
                <p>Built with ❤️ using Next.js, TypeScript, and AWS.</p>
            </footer>
        </div>
    );
};

export default Home;