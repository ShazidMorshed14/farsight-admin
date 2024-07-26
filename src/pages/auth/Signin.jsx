import { yupResolver } from "@hookform/resolvers/yup";
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Input,
  Paper,
  PasswordInput,
  Stack,
  Text,
  Title,
  createStyles,
} from "@mantine/core";
import { IconAlertTriangle, IconMail } from "@tabler/icons-react";
import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SignInApi } from "../../services/auth";
import { authActions } from "../../store/reducers/authReducer";
import { NotificationUtil } from "../../utils/notifications";
import { SignInSchema } from "../../validators/SignIn";

const useStyles = createStyles(() => ({
  wrapper: {
    minHeight: "100vh",
    backgroundSize: "cover",
    backgroundImage:
      "url(https://media.licdn.com/dms/image/C5612AQGCX8n0sJ2Gsg/article-cover_image-shrink_720_1280/0/1638702776884?e=2147483647&v=beta&t=FeD1HF3TYR98jJt_4BxXNFncwyjCvwW93ILha4zFj5Y)",
  },
}));

const SignInButton = (props) => {
  // This component is used for performance, otherwise the whole page will re-render on each keystroke
  // Because of useWatch, which is a stupid design from react-hooks-form
  // Because of this, only this component will re-render on keystroke, not the whole page

  const { control, isSubmitting } = props;

  const formVal = useWatch({ control });

  return (
    <Button
      radius="xs"
      type="submit"
      size="md"
      disabled={
        isSubmitting || !formVal.email || !formVal.password
        // This is intentional, I do not wish to use isValid here
      }
      // sx={{
      //   background: COLORS.primaryButton,
      // }}
      loading={isSubmitting}
    >
      Login
    </Button>
  );
};

const Signin = () => {
  const { classes } = useStyles();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [signInError, setSignInError] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(SignInSchema),
  });

  const handleSignIn = async (values) => {
    console.log(values);
    try {
      const response = await SignInApi(values.email, values.password);
      console.log(response);
      if (response.status === 200) {
        NotificationUtil({
          success: true,
          title: "Welcome",
          message: "Login Successful!",
        });
        dispatch(
          authActions.signin({
            user: response.data.user,
            accessToken: response.data.token,
            refreshToken: response.data.refreshToken,
          })
        );
        navigate("/dashboard");
      }
    } catch (err) {
      setSignInError(true);

      NotificationUtil({
        success: false,
        title: "Try again!",
        message: "Invalid login credentials",
      });
    }
  };

  return (
    <div className={classes.wrapper}>
      <Stack
        align="center"
        justify="center"
        sx={{
          height: "100vh",
        }}
      >
        <Paper p="lg" radius="xs" shadow="md">
          <form onSubmit={handleSubmit(handleSignIn)}>
            <Stack
              sx={{
                width: 310,
              }}
            >
              {/* <Box
              component="img"
              src="/pulse-logo.png"
              sx={{
                flex: 1,
              }}
              style={{ height: '5rem' }}
            /> */}
              <Box>
                {/* <Flex justify="center" align="center">
                  <img
                    src="/pulse-logo.png"
                    alt=""
                    style={{ height: "10em" }}
                  />
                </Flex> */}
              </Box>
              <Title order={2} align="center">
                Sign In
              </Title>
              <Text align="center">
                <b>E-Commerce Dashboard</b>
                <br></br>
                <Text fz="sm" color="dimmed">
                  {" "}
                  version 1.0
                </Text>
              </Text>
              {signInError && (
                <Alert
                  icon={<IconAlertTriangle size="1rem" />}
                  title=""
                  color="red"
                  fz="xs"
                >
                  Invalid Login Credentials
                </Alert>
              )}
              <div>
                <Input
                  {...register("email")}
                  type="text"
                  rightSection={<IconMail />}
                  placeholder="Your Email/Phone"
                  size="md"
                />
                {errors && errors.email && (
                  <Text fz="xs" color="red" py="xs">
                    {errors.email.message}
                  </Text>
                )}
              </div>
              <div>
                <PasswordInput
                  {...register("password")}
                  withAsterisk
                  placeholder="Your Password"
                  size="md"
                />
                {errors && errors.password && (
                  <Text fz="xs" color="red" py="xs">
                    {errors.password.message}
                  </Text>
                )}
              </div>

              <ActionIcon
                //onClick={() => navigate("/forgot-password")}
                variant="transparent"
                color="indigo"
                sx={{
                  width: "max-content",
                }}
              >
                <Text align="left" fz="xs">
                  Forgot Password?
                </Text>
              </ActionIcon>

              <SignInButton isSubmitting={isSubmitting} control={control} />
              {/* <Text
              align="center"
              component={Link}
              sx={{
                textDecoration: 'underline',
              }}
              to="/download-app">
              Download App
            </Text> */}
            </Stack>
          </form>
        </Paper>
      </Stack>
    </div>
  );
};

export default Signin;
