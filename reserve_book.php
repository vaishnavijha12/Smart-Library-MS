<?php
// reserve_book.php
include 'db_connect.php'; // make sure this points to your DB connection file
session_start();

// Get current user ID from session
if (!isset($_SESSION['user_id'])) {
    echo "You must be logged in to reserve a book.";
    exit;
}

$user_id = $_SESSION['user_id'];

// Get book ID from POST
if (!isset($_POST['book_id'])) {
    echo "No book selected.";
    exit;
}

$book_id = $_POST['book_id'];

// Check if book is already reserved by this user
$stmt = $conn->prepare("SELECT * FROM reservations WHERE book_id=? AND user_id=? AND status='active'");
$stmt->execute([$book_id, $user_id]);

if ($stmt->rowCount() > 0) {
    echo "You have already reserved this book.";
    exit;
}

// Insert reservation
$insert = $conn->prepare("INSERT INTO reservations (book_id, user_id) VALUES (?, ?)");
if ($insert->execute([$book_id, $user_id])) {
    echo "Book reserved successfully!";
} else {
    echo "Failed to reserve the book. Please try again.";
}
?>
