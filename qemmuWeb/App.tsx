import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/spotlight/styles.css';
import { BrowserRouter } from 'react-router-dom'
import QueryClientProvider from "@/query"
import {DirectionProvider} from "@mantine/core";
import Layout from "@/layout/layout";

function App() {

  return (
      <QueryClientProvider>
          <BrowserRouter>
              <DirectionProvider initialDirection="ltr" detectDirection={false}>
                  <Layout/>
              </DirectionProvider>
          </BrowserRouter>
      </QueryClientProvider>
  )
}

export default App;
