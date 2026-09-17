import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  ErrorMessage,
  Form,
  Input,
  Label,
  Spinner,
  TextField,
  Typography,
} from "@heroui/react";
import { AuthContext } from "../../context/auth.context";
import { useNavigate, Link } from "react-router-dom";
import { loginAsync } from "../../services/scrumigoApi.service.js";
import { Key } from "lucide-react";
import scrumigoLogoFull from "../../assets/scrumigo_logo_full.png";

function LoginPage() {
  const navigate = useNavigate();
  const { setUserVariables, isLoggedIn } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    isLoggedIn && navigate("/");
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await loginAsync(email, password);
      setUserVariables(result.authToken, result.payload);
      navigate("/");
    } catch (error) {
      if (error.response.status === 400) {
        setErrorMessage(error.response.data.errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-background-secondary text-foreground min-h-screen flex items-center justify-center p-6">
      {isLoading ? (
        <div className="flex justify-center">
          <Spinner size="xl" />
        </div>
      ) : (
        <div className="relative w-full max-w-md">
          <img
            src={scrumigoLogoFull}
            alt="SCRUMiGO"
            className="absolute bottom-full left-1/2 mb-5 h-22 -translate-x-1/2 object-contain"
          />
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </TextField>
                  <TextField isRequired name="password" type="password">
                    <Label>Password</Label>
                    <Input
                      placeholder="••••••••"
                      variant="secondary"
                      value={password}
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
      )}
    </main>
  );
}

export default LoginPage;
