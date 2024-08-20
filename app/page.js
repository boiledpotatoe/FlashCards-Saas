'use client';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline, AppBar, Box, Button, Container, Grid, Toolbar, Typography } from "@mui/material";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import { useRouter } from "next/navigation";
import getStripe from "@/utils/get-stripe";
import { motion } from "framer-motion";
import { Lightbulb, Sync, Timer } from '@mui/icons-material';

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0bec5",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push('/generate');
    } else {
      router.push('/sign-in');
    }
  };

  const handleBasicPlan = () => {
    if (isSignedIn) {
      router.push('/generate');
    } else {
      router.push('/sign-in');
    }
  };

  const handlePremiumPlan = async () => {
    try {
      const checkoutSession = await fetch('/api/checkout_session', {
        method: 'POST',
        headers: {
          origin: 'https://localhost:3000',
        },
      });
      const checkoutSessionJson = await checkoutSession.json();
      if (checkoutSession.statusCode === 500) {
        console.error(checkoutSession.message);
        return;
      }
      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id,
      });
      if (error) {
        console.warn(error.message);
      }
    } catch (err) {
      console.error('Failed to redirect to Stripe:', err);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg" disableGutters>
        <Head>
          <title>PromptWise</title>
          <meta name="description" content="Create Flashcards from a prompt" />
        </Head>

        {/* Navigation Bar */}
        <AppBar position="sticky" sx={{ backgroundColor: "#2e3b55", boxShadow: "none" }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }} className="shiny-text">
              PromptWise
            </Typography>
            <SignedOut>
              <Button
                color="inherit"
                href="/sign-in"
                sx={{ marginRight: 2, "&:hover": { backgroundColor: "#90caf9" } }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                href="/sign-up"
                sx={{ "&:hover": { backgroundColor: "#90caf9" } }}
              >
                Sign Up
              </Button>
            </SignedOut>
            <SignedIn>
              <Button
                color="inherit"
                href="/flashcards"
                sx={{ marginRight: 2, "&:hover": { backgroundColor: "#90caf9" } }}
              >
                My Flashcards
              </Button>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>

        {/* Hero Section */}
        <Box
          sx={{
            height: "80vh",
            background: "linear-gradient(135deg, #1e1e1e 50%, #2e3b55 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: "#fff",
            padding: "0 20px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box>
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, type: "spring", stiffness: 50 }}
            >
              <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold", fontSize: "3rem" }}>
                Welcome to PromptWise
              </Typography>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, type: "spring", stiffness: 50, delay: 0.3 }}
            >
              <Typography variant="h5" sx={{ mb: 4, fontWeight: 300 }}>
                Create flashcards effortlessly from any prompt. Simplify your study routine today!
              </Typography>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{
                  padding: "12px 24px",
                  fontSize: "1rem",
                  backgroundColor: "#90caf9",
                  "&:hover": { backgroundColor: "#64b5f6", boxShadow: "0px 0px 20px rgba(100, 181, 246, 0.5)" },
                  transition: "all 0.3s ease",
                }}
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </motion.div>
          </Box>
        </Box>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ my: 6, px: 3 }}>
            <Typography variant="h3" textAlign="center" mb={4} sx={{ fontWeight: "bold" }}>
              Features
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={4}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 3,
                      borderRadius: 2,
                      backgroundColor: "#1e1e1e",
                      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
                      transition: "transform 0.3s",
                      "&:hover": {
                        transform: "translateY(-10px)",
                      },
                    }}
                  >
                    <Lightbulb color="primary" sx={{ fontSize: 50 }} />
                    <Typography variant="h6" mt={2}>
                      Easy Prompt Input
                    </Typography>
                    <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                      Quickly generate flashcards from simple text prompts. Streamline your study process with ease.
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 3,
                      borderRadius: 2,
                      backgroundColor: "#1e1e1e",
                      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
                      transition: "transform 0.3s",
                      "&:hover": {
                        transform: "translateY(-10px)",
                      },
                    }}
                  >
                    <Sync color="primary" sx={{ fontSize: 50 }} />
                    <Typography variant="h6" mt={2}>
                      Smart Flashcards
                    </Typography>
                    <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                      Sync your flashcards and study progress across devices, allowing you to study anytime, anywhere.
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 3,
                      borderRadius: 2,
                      backgroundColor: "#1e1e1e",
                      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
                      transition: "transform 0.3s",
                      "&:hover": {
                        transform: "translateY(-10px)",
                      },
                    }}
                  >
                    <Timer color="primary" sx={{ fontSize: 50 }} />
                    <Typography variant="h6" mt={2}>
                      Flashcards Generated in Minutes
                    </Typography>
                    <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                      Customize and create flashcards in minutes. Focus on learning with minimal effort.
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Box>
        </motion.div>

        {/* Pricing Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Box sx={{ my: 6, textAlign: "center", px: 3 }}>
            <Typography variant="h3" padding={3} sx={{ fontWeight: "bold" }}>
              Pricing
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: "background.paper",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
                    borderRadius: 2,
                    "&:hover": {
                      transform: "scale(1.05)",
                      transition: "transform 0.3s",
                    },
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>Basic</Typography>
                  <Typography variant="h6">Free</Typography>
                  <Typography padding={1}>
                    Get started with essential features. Generate and save flashcards with limited storage. Access to saved flashcards.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      mt: 2,
                      backgroundColor: "#90caf9",
                      "&:hover": { backgroundColor: "#64b5f6" },
                    }}
                    onClick={handleBasicPlan}
                  >
                    Choose Plan
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: "background.paper",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
                    borderRadius: 2,
                    "&:hover": {
                      transform: "scale(1.05)",
                      transition: "transform 0.3s",
                    },
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>Premium</Typography>
                  <Typography variant="h6">$5 / month</Typography>
                  <Typography padding={1}>
                    Unlock advanced features and enjoy unlimited storage. Enhance your learning experience with premium tools.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      mt: 2,
                      backgroundColor: "#90caf9",
                      "&:hover": { backgroundColor: "#64b5f6" },
                    }}
                    href="https://buy.stripe.com/6oE4hD5esdyugcE5kk"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Choose Plan
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </motion.div>
      </Container>
    </ThemeProvider>
  );
}
