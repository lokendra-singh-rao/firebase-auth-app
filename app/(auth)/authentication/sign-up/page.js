"use client";

// import node module libraries
import { Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import Link from "next/link";
import { auth } from "components/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";

// import hooks
import useMounted from "hooks/useMounted";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const SignUp = () => {
  const hasMounted = useMounted();
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showEmail, setShowEmail] = useState("");

  const [passwordMatch, setPasswordMatch] = useState(true);
  const [errorRegistering, setErrorRegistering] = useState(false);
  const [successRegistering, setSuccessRegistering] = useState(false);
  const [errorRegisteringMessage, setErrorRegisteringMessage] = useState("");

  const actionCodeSettings = {
    url: "http://localhost:3000/authentication/sign-in?activationRedirect=true",
  };

  useEffect(() => {
    const user = auth?.currentUser;
    if (
      user?.emailVerified &&
      user?.emailVerified != undefined &&
      user?.emailVerified != null &&
      user != null
    ) {
      router.push("/");
    } else {
      signOut(auth);
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setPasswordMatch(true);
    setErrorRegistering(false);
    setSuccessRegistering(false);
    setErrorRegisteringMessage("");

    if (password === confirmPassword) {
      try {
        await createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up
            saveSignUpData(e, userCredential?.user);
          })
          .catch((error) => {
            // Error in Signing up
            if (error?.code == "auth/email-already-in-use") {
              setErrorRegisteringMessage("Email already in use!");
            }

            setErrorRegistering(true);
          });
      } catch (error) {
        setErrorRegistering(true);
      }
    } else {
      setPasswordMatch(false);
    }
  };

  const saveSignUpData = async (e, user) => {
    e.preventDefault();

    try {
      let headers = {
        "FirebaseToken": `${user?.accessToken}`,
      };

      await axios({
        url: `http://localhost:8081/graphql`,
        method: "POST",
        headers: headers,
        data: {
          query: `
          mutation SignUpUser {
            signUpUser(fullname : "${fullname}", email : "${email}")
          }
          `,
        },
      })
        .then(async (res) => {
          if (res?.data?.errors) {
            setErrorRegistering(true);
          } else if (res?.data?.data?.signUpUser == null) {
            setErrorRegistering(true);
          } else if (res?.data?.data?.signUpUser != null) {
            sendVerificationEmail(user, e);
          }
        })
        .catch((error) => {
          setErrorRegistering(true);
        });
    } catch (error) {
      setErrorRegistering(true);
    }
  };

  const sendVerificationEmail = async (user, e) => {

    e.preventDefault();

    try {
      await sendEmailVerification(user, actionCodeSettings)
        .then((data) => {
          // Email sent

          setSuccessRegistering(true);
          setShowEmail(email);
          setFullname("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        })
        .catch((error) => {
          setErrorRegistering(true);
        });
    } catch (error) {
      setErrorRegistering(true);
    }
  };

  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        {/* Card */}
        <Card className="smooth-shadow-md">
          {/* Card body */}
          <Card.Body className="p-6">
            <div className="mb-4">
              <h1 className="text-center">Sign Up</h1>
              <p className="mb-6 text-center">
                Please enter your user information.
              </p>
            </div>

            {/* Form */}
            {hasMounted && (
              <Form onSubmit={(e) => handleSubmit(e)}>
                {/* Fullname */}
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Fullname</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullname"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    placeholder="Enter fullname"
                    required={true}
                  />
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    required={true}
                  />
                </Form.Group>

                {/* Password */}
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required={true}
                    autoComplete="on"
                  />
                </Form.Group>

                {/* Confirm Password */}
                <Form.Group className="mb-3" controlId="confirm-password">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required={true}
                    autoComplete="on"
                  />
                </Form.Group>

                {/* Password not Match Error */}
                {!passwordMatch && (
                  <Alert variant="danger">Password does not match!</Alert>
                )}

                {/* Registration Error Message */}
                {errorRegistering ? (
                  errorRegisteringMessage != "" ? (
                    <Alert variant="danger">{errorRegisteringMessage}</Alert>
                  ) : (
                    <Alert variant="danger">
                      Registration failed, please try again!
                    </Alert>
                  )
                ) : (
                  <></>
                )}

                {/* Registration Success Message */}
                {successRegistering && (
                  <Alert variant="success">
                    <Alert.Heading>Registered Successfully!</Alert.Heading>
                    <p>
                      Please click on the verification link sent to{" "}
                      <strong>{showEmail}</strong> to verify your email.
                    </p>
                  </Alert>
                )}

                {/* Checkbox */}
                <div className="mb-3">
                  <Form.Check type="checkbox" id="check-api-checkbox">
                    <Form.Check.Input type="checkbox" required />
                    <Form.Check.Label>
                      {" "}
                      I agree to the <Link href="#">
                        {" "}
                        Terms of Service{" "}
                      </Link>{" "}
                      and <Link href="#"> Privacy Policy.</Link>
                    </Form.Check.Label>
                  </Form.Check>
                </div>

                <div>
                  {/* Button */}
                  <div className="d-grid">
                    <Button variant="primary" type="submit">
                      Sign Up
                    </Button>
                  </div>
                  <div className="d-md-flex justify-content-between mt-4">
                    <div className="mb-2 mb-md-0">
                      <Link href="/authentication/sign-in" className="fs-5">
                        Already member? Login{" "}
                      </Link>
                    </div>
                    <div>
                      <Link
                        href="/authentication/forget-password"
                        className="text-inherit fs-5"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default SignUp;
