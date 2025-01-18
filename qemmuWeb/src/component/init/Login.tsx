import { Anchor, Button, Checkbox, Container, Group, Paper, PasswordInput, Text, TextInput, Title } from "@mantine/core";
import classes from "./Register.module.css";
import { useState } from "react";
import { useLogin } from "./query";
import { notifications } from "@mantine/notifications";
import { loginUser, sectionStatus } from "./store/data";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Login({ setCurrentSection }: { setCurrentSection: any }) {

    const [newLoginUser, setNewLoginUser] = useState<loginUser>({ email: "", password: "" })

    const muateLogin = useLogin()

    const handleLogin = () => {

        if (newLoginUser.email && newLoginUser.password) {

            muateLogin.mutateAsync(newLoginUser).then((data: any) => {
                notifications.show({
                    color: 'teal',
                    title: "Login Status",
                    message: data?.message || "",
                    autoClose: 2000,
                });
                if (data?.message == "Login successful") {
                    window.location.reload();
                }
            })
        }

    }
    return (
        <div className="parent-wrapper">
            <Container size={420} my={40}>
                <Title ta="center" className={classes.title}>
                    Welcome back!
                </Title>
                <Text c="dimmed" size="sm" ta="center" mt={5}>
                    Do not have an account yet?{' '}
                    <Anchor size="sm" component="button" onClick={() => { setCurrentSection(sectionStatus.REGISTER) }} >
                        Create account
                    </Anchor>
                </Text>
                <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                    <TextInput value={newLoginUser.email} type="email" label="Email" placeholder="you@mantine.dev" required onChange={(e) => setNewLoginUser((prev) => ({
                        ...prev,
                        email: e.target.value
                    }))} />
                    <PasswordInput value={newLoginUser.password} label="Password" placeholder="Your password" required mt="md" onChange={(e) => setNewLoginUser((prev) => ({
                        ...prev,
                        password: e.target.value
                    }))} />
                    <Group justify="space-between" mt="lg">
                        <Checkbox label="Remember me" />
                        <Anchor component="button" size="sm">
                            Forgot password?
                        </Anchor>
                    </Group>
                    <Button fullWidth mt="xl" onClick={handleLogin}>
                        Sign in
                    </Button>
                </Paper>
            </Container>
        </div >
    );
}