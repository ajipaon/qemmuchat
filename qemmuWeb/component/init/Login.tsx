import { Anchor, Button, Checkbox, Container, Group, Paper, PasswordInput, Text, TextInput, Title } from "@mantine/core";
import classes from "@/component/init/Register.module.css";
import { loginUser, sectionStatus } from "@/component/init/store/data.ts";
import { useState } from "react";
import { useLogin } from "./query";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Login({ sectionCurrent, setCurrentSection }: { sectionCurrent: sectionStatus, setCurrentSection: any }) {

    const [newLoginUser, setNewLoginUser] = useState<loginUser>({ email: "", password: "" })

    const muateLogin = useLogin()

    const handleLogin = () => {

        if (newLoginUser.email && newLoginUser.password) {

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            muateLogin.mutateAsync(newLoginUser).then((data: any) => {
                if (data?.message == "Login successful") {
                    window.location.reload();
                }
            })
        }

    }

    if (sectionCurrent == sectionStatus.LOGIN) {
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
}