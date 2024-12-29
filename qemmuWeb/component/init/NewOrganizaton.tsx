
import {
    Anchor,
    Center,
    Container,
    Group,
    Paper,
    TextInput,
    Title,
} from '@mantine/core';
import classes from './NewOrganization.module.css';
import {newSection, sectionStatus} from "@/component/init/store/data.ts";

export default function NewOrganizaton() {
    const {section} =  newSection();

    if (section !== sectionStatus.NEW_ORGANIZATION) {
        return null;
    }
    return (
        <Container size={560} my={30}>
            <Title className={classes.title} ta="center">
                First, create your organization
            </Title>
            <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
                <TextInput label="Organiaton Name" placeholder="name" required />
                <Group justify="space-between" mt="lg" className={classes.controls}>
                    <Anchor c="dimmed" size="sm" className={classes.control}>
                    </Anchor>
                </Group>
            </Paper>
        </Container>
    );
}