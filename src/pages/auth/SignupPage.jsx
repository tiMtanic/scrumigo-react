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
import { AuthContext } from "../../context/auth.context.jsx";
import { useNavigate, Link } from "react-router-dom";
import scrumigoApiService, { signUpAsync } from "../../services/scrumigoApi.service.js";
import { UserPlus } from "lucide-react";

function SignupPage() {
  const navigate = useNavigate();
  const { setUserVariables, isLoggedIn } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
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
      const result = await signUpAsync(name, surname, email, password);
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
          <Typography
            type="h1"
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-10"
          >
            SCRUMiGO
          </Typography>
          <Card className="w-full max-w-md">
            <Card.Header>
              <Card.Title className="flex items-center justify-center gap-1 mb-2">
                <UserPlus className="h-4 w-4" />
                Signup
              </Card.Title>
            </Card.Header>
            <Form onSubmit={onSubmit}>
              <Card.Content>
                <div className="flex flex-col gap-4">
                  <TextField isRequired name="name" type="text">
                    <Label>Name</Label>
                    <Input
                      placeholder="Parry"
                      variant="secondary"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </TextField>
                  <TextField isRequired name="surname" type="text">
                    <Label>Surname</Label>
                    <Input
                      placeholder="Hotter"
                      variant="secondary"
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                    />
                  </TextField>
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
                  Create Account
                </Button>
                <Link to="/login" className="link text-center text-sm">
                  Sign in with an existing Account
                </Link>
              </Card.Footer>
            </Form>
          </Card>
        </div>
      )}
    </main>
  );
}

export default SignupPage;
