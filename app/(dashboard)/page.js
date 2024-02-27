"use client";
// import node module libraries
import { Fragment, useEffect, useState } from "react";
import { Container, Col, Row, Card, Image } from "react-bootstrap";
import Link from 'next/link';

// import firebase
import { auth } from "components/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import axios from "axios";
import Loading from "app/(auth)/authentication/loading";

const Home = () => {
    
    const router = useRouter();
    const [userData, setUserData] = useState("");
    const [isLoading, setIsLoading] = useState(true)
    const [errorFetchingData, setErrorFetchingData] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user?.emailVerified) {
        console.log("======= uid", user.uid);
        getUserdata(user?.accessToken)
      } else {
        router.push('/authentication/sign-in?activationRedirect=false')
      }
    });
  }, [router]);

  const getUserdata = async (token) => {
    try {

      setIsLoading(true)

      let headers = {
        FirebaseToken: `${token}`,
      };

      await axios({
        url: `http://localhost:8081/graphql`,
        method: "POST",
        headers: headers,
        data: {
          query: `
              query GetUserData {
                getUserData {
                  uid
                  fullname
                  email
                  accountStatus
                  lastLogin
                  createdAt
                }
              }
              `,
        },
      })
        .then(async (res) => {
          if (res?.data?.errors) {
            setErrorFetchingData(true);
          } else if (res?.data?.data?.getUserData == null) {
            setErrorFetchingData(true);
          } else {
            setUserData(res?.data?.data?.getUserData);
            setIsLoading(false)
          }
        })
        .catch((error) => {
        });
    } catch (error) {
    }
  };

  const logout = async (e) => {
    e.preventDefault()
    await signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("Signed out successfully");
        router.push("/authentication/sign-in?activationRedirect=false");
      })
      .catch((error) => {
        
      });
  };

  return (
     <Fragment>
      {errorFetchingData ?<h1 className="text-center mt-16">Error in fetching data, please try reloading the page!</h1> : isLoading? <Loading></Loading> : <Container fluid className="p-6">

      {/* PROFILE HEADER */}
      <Row className="align-items-center mb-6">
      <Col xl={12} lg={12} md={12} xs={12}>
        {/* Bg */}
        <div className="pt-20 rounded-top" style={{ background: 'url(/images/background/profile-cover.jpg) no-repeat', backgroundSize: 'cover' }}>
        </div>
        <div className="bg-white rounded-bottom smooth-shadow-sm ">
          <div className="d-flex align-items-center justify-content-between pt-4 pb-6 px-4">
            <div className="d-flex align-items-center">
              {/* avatar */}
              <div className="avatar-xxl me-2 position-relative d-flex justify-content-end align-items-end mt-n10">
                <Image src="/images/avatar/avatar.png" className="avatar-xxl rounded-circle border border-4 border-white-color-40" alt="" />
                <Link href="#!" className="position-absolute top-0 right-0 me-2" data-bs-toggle="tooltip" data-placement="top" title="" data-original-title="Verified">
                  <Image src="/images/svg/checked-mark.svg" alt="" height="30" width="30" />
                </Link>
              </div>
              {/* text */}
              <div className="lh-1">
                <h2 className="mb-0">{userData?.fullname}
                  <Link href="#!" className="text-decoration-none" data-bs-toggle="tooltip" data-placement="top" title="" data-original-title="Beginner">
                  </Link>
                </h2>
                <p className="mb-0 d-block">@{userData?.fullname?.toString().toLowerCase().split(" ")}</p>
              </div>
            </div>
            <div>
              <Link href="#" className="btn btn-outline-primary d-none d-md-block" onClick={(e)=>logout(e)}>Log Out</Link>
            </div>
          </div>
        </div>
      </Col>
    </Row>
    {/* ABOUT ME SECTION */}
    <Col xl={12} lg={12} md={12} xs={12} className="mb-6">
      {/* card */}
      <Card>
        {/* card body */}
        <Card.Body>
          {/* card title */}
          <Card.Title as="h4">Account Information</Card.Title>
          <Row>
            <Col xs={6} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">Email</h6>
              <p className="mb-0">{userData?.email}</p>
            </Col>
            <Col xs={6} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">Firebase uid </h6>
              <p className="mb-0">{userData?.uid}</p>
            </Col>
            <Col xs={6} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">Account Status</h6>
              <p className="mb-0">{userData?.accountStatus}</p>
            </Col>
            <Col xs={6}>
              <h6 className="text-uppercase fs-5 ls-2">Created At</h6>
              <p className="mb-0">{userData?.createdAt}</p>
            </Col>
            <Col xs={6}>
              <h6 className="text-uppercase fs-5 ls-2">Last Login At</h6>
              <p className="mb-0">{userData?.lastLogin}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
    </Container>}
    </Fragment>
  );
};
export default Home;
