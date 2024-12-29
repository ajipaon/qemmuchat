import {Anchor, Button, Checkbox, Container, Group, Paper, PasswordInput, Text, TextInput, Title} from "@mantine/core";
import classes from "@/component/init/Register.module.css";
import {newSection, sectionStatus} from "@/component/init/store/data.ts";


export default function Login() {
    const {section, setSection} =  newSection();

    if (section !== sectionStatus.LOGIN) {
        return null;
    }

    return (
        <div className="parent-wrapper">
            <Container size={420} my={40}>
                <Title ta="center" className={classes.title}>
                    Welcome back!
                </Title>
                <Text c="dimmed" size="sm" ta="center" mt={5}>
                    Do not have an account yet?{' '}
                    <Anchor size="sm" component="button" onClick={ () => {setSection(sectionStatus.REGISTER)}}>
                        Create account
                    </Anchor>
                </Text>
                <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                    <TextInput label="Email" placeholder="you@mantine.dev" required/>
                    <PasswordInput label="Password" placeholder="Your password" required mt="md"/>
                    <Group justify="space-between" mt="lg">
                        <Checkbox label="Remember me"/>
                        <Anchor component="button" size="sm">
                            Forgot password?
                        </Anchor>
                    </Group>
                    <Button fullWidth mt="xl">
                        Sign in
                    </Button>
                </Paper>
            </Container>
        </div>
    );
}