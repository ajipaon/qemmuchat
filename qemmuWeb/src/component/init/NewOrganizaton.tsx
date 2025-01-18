
import {
    Anchor,
    Button,
    Container,
    Group,
    Paper,
    TextInput,
    Title,
} from '@mantine/core';
import classes from './NewOrganization.module.css';
import { useAddConfig } from './query';
import { useState } from 'react';
import { dataConfig, sectionStatus } from './store/data';

export default function NewOrganizaton({ section }: { section: sectionStatus }) {

    const [newConfig, setNewConfig] = useState<dataConfig>({ name: sectionStatus.NEW_APP, data: null })
    const configMutation = useAddConfig()

    const handleAddConfig = () => {

        configMutation.mutate(newConfig)
    }

    if (section == sectionStatus.NEW_APP) {
        return (
            <Container size={560} my={30}>
                <Title className={classes.title} ta="center">
                    First, create your App
                </Title>
                <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
                    <TextInput value={newConfig.data || ""} label="Organiaton Name" placeholder="name" required onChange={(e) => setNewConfig((prev) => ({
                        ...prev,
                        data: e.target.value
                    }))} />
                    <Group justify="space-between" mt="lg" className={classes.controls}>
                        <Anchor c="dimmed" size="sm" className={classes.control}>
                        </Anchor>
                    </Group>
                    <Button fullWidth onClick={handleAddConfig}>Create App</Button>
                </Paper>
            </Container>
        )
    }
}