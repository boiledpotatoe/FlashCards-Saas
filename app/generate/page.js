'use client';

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import { db } from "/firebase";
import React, { useState } from 'react';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Container, Box, Button, Card, CardActionArea, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, TextField, Typography, Grid } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
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

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser();
    const router = useRouter();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [text, setText] = useState('');
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');

    const handleSubmit = async () => {
        fetch('api/generate', {
            method: 'POST',
            body: text,
        })
            .then((res)=> res.json())
            .then((data)=> setFlashcards(data))
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const saveFlashcards = async () => {
        if (!isSignedIn || !user) {
            alert('You must be signed in to save flashcards.');
            return;
        }
    
        if (!name) {
            alert('Please enter a name');
            return;
        }
    
        const batch = writeBatch(db);
        const userDocRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(userDocRef);
    
        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || [];
            if (collections.find((f) => f.name === name)) {
                alert('Flashcard collection with the same name already exists.');
                return;
            } else {
                collections.push({ name });
                batch.set(userDocRef, { flashcards: collections }, { merge: true });
            }
        } else {
            batch.set(userDocRef, { flashcards: [{ name }] });
        }
    
        const colRef = collection(userDocRef, name);
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef);
            batch.set(cardDocRef, flashcard);
        });
    
        await batch.commit();
        handleClose();
        router.push('/flashcards');
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Container maxWidth="md">
                <Box sx={{
                    mt: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}>
                    <Typography variant="h4" mb={2}>
                        Generate Flashcards
                    </Typography>
                    <Paper sx={{ p: 4, width: '100%', backgroundColor: "background.paper" }}>
                        <TextField
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            label="Enter a prompt"
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            sx={{ mb: 2 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            fullWidth
                            sx={{
                                backgroundColor: "#90caf9",
                                "&:hover": { backgroundColor: "#64b5f6" },
                            }}
                        >
                            Submit
                        </Button>
                    </Paper>
                </Box>
                {flashcards.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h5" textAlign="center" mb={2}>
                            Flashcards Preview
                        </Typography>
                        <Grid container spacing={3}>
                            {flashcards.map((flashcard, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card>
                                        <CardActionArea onClick={() => handleCardClick(index)}>
                                            <CardContent>
                                                <Box sx={{
                                                    perspective: '1000px',
                                                    '& > div': {
                                                        transition: 'transform 0.6s',
                                                        transformStyle: 'preserve-3d',
                                                        position: 'relative',
                                                        width: '100%',
                                                        height: '200px',
                                                        boxShadow: '0 4px 8px 0 rgba(0,0,0, 0.2)',
                                                        transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                                    },
                                                    '& > div > div': {
                                                        position: 'absolute',
                                                        width: '100%',
                                                        height: '100%',
                                                        backfaceVisibility: "hidden",
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        padding: 2,
                                                        boxSizing: 'border-box',
                                                    },
                                                    '& > div > div:nth-of-type(2)': {
                                                        transform: 'rotateY(180deg)',
                                                    },
                                                }}>
                                                    <div>
                                                        <div>
                                                            <Typography variant="h6" component="div">
                                                                {flashcard.front}
                                                            </Typography>
                                                        </div>
                                                        <div>
                                                            <Typography variant="h6" component="div">
                                                                {flashcard.back}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </Box>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleOpen}
                                sx={{
                                    backgroundColor: "#f48fb1",
                                    "&:hover": { backgroundColor: "#f06292" },
                                }}
                            >
                                Save
                            </Button>
                        </Box>
                    </Box>
                )}
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Save PromptWise Flashcards</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter a name for your flashcards collection
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Collection Name"
                            type="text"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            variant="outlined"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={saveFlashcards}>Save</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </ThemeProvider>
    );
}
