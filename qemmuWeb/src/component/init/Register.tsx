import { Anchor, Button, Checkbox, Container, Group, Paper, PasswordInput, Text, TextInput, Title } from "@mantine/core";
import classes from "./Register.module.css";
import { useState } from "react";
import { useRegister } from "./query";
import { registerUser, sectionStatus } from "./store/data";
import { notifications } from "@mantine/notifications";

export default function Register({ setCurrentSection }: { setCurrentSection: any }) {

    const [newRegister, setNewRegister] = useState<registerUser>({ name: "", email: "", password: "" })
    const mutateRegister = useRegister()

    const handleSignUp = () => {

        mutateRegister.mutateAsync(newRegister).then((data: any) => {
            notifications.show({
                color: data.message == "Register success" ? 'teal' : "orange",
                title: "Register Status",
                message: data?.message || "",
                autoClose: 2000,
            });
            if (data.message == "Register success") {
                setCurrentSection(sectionStatus.LOGIN)
            }
        })
    }

    return (
        <div className="parent-wrapper">
            <Container size={420} my={40}>
                <Title ta="center" className={classes.title}>
                    Register now!
                </Title>
                <Text c="dimmed" size="sm" ta="center" mt={5}>
                    Do you have an account?{' '}
                    <Anchor size="sm" component="button" onClick={() => setCurrentSection(sectionStatus.LOGIN)}>
                        Login now
                    </Anchor>
                </Text>
                <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                    <TextInput label="name" value={newRegister.name} placeholder="name" required onChange={(e) => setNewRegister((prev) => ({
                        ...prev,
                        name: e.target.value
                    }))} />
                    <TextInput label="Email" type="email" value={newRegister.email} placeholder="you@mantine.dev" required onChange={(e) => setNewRegister((prev) => ({
                        ...prev,
                        email: e.target.value
                    }))} />
                    <PasswordInput label="Password" value={newRegister.password} type="password" placeholder="Your password" required mt="md" onChange={(e) => setNewRegister((prev) => ({
                        ...prev,
                        password: e.target.value
                    }))} />
                    <Group justify="space-between" mt="lg">
                        <Checkbox label="Remember me" />
                    </Group>
                    <Button fullWidth mt="xl" onClick={handleSignUp}>
                        Sign Up
                    </Button>
                </Paper>
            </Container>
        </div>
    )

}