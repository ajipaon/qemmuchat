import { BrowserRouter } from 'react-router-dom'
import { DirectionProvider } from "@mantine/core";
import { QueryProvider } from './query';
import Layout from './layout/layout';

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
