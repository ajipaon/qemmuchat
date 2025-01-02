import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/spotlight/styles.css';
import { BrowserRouter } from 'react-router-dom'
import { QueryProvider } from "@/query"
import { DirectionProvider } from "@mantine/core";
import Layout from "@/layout/layout";

function App() {

    return (
        <BrowserRouter>
            <DirectionProvider initialDirection="ltr" detectDirection={false}>
                <QueryProvider>
                    <Layout />
                </QueryProvider>
            </DirectionProvider>
        </BrowserRouter>
    )
}

export default App;
