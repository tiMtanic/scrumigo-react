import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  ErrorMessage,
  Form,
  Input,
  Label,
  TextField,
  Typography,
} from "@heroui/react";
import { AuthContext } from "../../context/auth.context";
import { useNavigate, Link } from "react-router-dom";
import scrumigoApiService from "../../services/scrumigoApi.service.js";
import { Key } from "lucide-react";

function LoginPage() {
  const navigate = useNavigate();
  const { setUserVariables, isLoggedIn } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    isLoggedIn && navigate("/");
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    const body = {
      email,
      password,
    };

    try {
      const response = await scrumigoApiService.post(`/auth/login`, body);
      setUserVariables(response.data.authToken, response.data.payload);
      navigate("/");
    } catch (error) {
      if (error.response.status === 400) {
        setErrorMessage(error.response.data.errorMessage);
      }
    }
  };

  return (
    <main className="bg-background-secondary text-foreground min-h-screen flex items-center justify-center p-6">
      <div className="relative w-full max-w-md">
        <Typography
          type="h1"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-10"
        >
          SCRUMiGO
        </Typography>
        <Card className="w-full max-w-md">
          <Card.Header>
            <Card.Title className="flex items-center justify-center gap-1 mb-2">
              <Key className="h-4 w-4" />
              Login
            </Card.Title>
          </Card.Header>
          <Form onSubmit={onSubmit}>
            <Card.Content>
              <div className="flex flex-col gap-4">
                <TextField isRequired name="email" type="email">
                  <Label>Email</Label>
                  <Input
                    placeholder="email@example.com"
                    variant="secondary"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </TextField>
                <TextField isRequired name="password" type="password">
                  <Label>Password</Label>
                  <Input
                    placeholder="••••••••"
                    variant="secondary"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </TextField>
                {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
              </div>
            </Card.Content>
            <Card.Footer className="mt-4 flex flex-col gap-2">
              <Button className="w-full" type="submit">
                Sign In
              </Button>
              <Link to="/signup" className="link text-center text-sm">
                Create a new Account
              </Link>
            </Card.Footer>
          </Form>
        </Card>
      </div>
    </main>
  );
}

export default LoginPage;
