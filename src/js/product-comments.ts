import { addComment, getComments, getSignedInName, type ProductComment } from "./comments.ts";

const productId = document.querySelector<HTMLElement>("#product-page")?.dataset.productId;
const listElement = document.querySelector<HTMLUListElement>("#comment-list");
const countElement = document.querySelector<HTMLElement>("#comment-count");
const form = document.querySelector<HTMLFormElement>("#comment-form");
const nameInput = document.querySelector<HTMLInputElement>("#comment-name");
const textInput = document.querySelector<HTMLTextAreaElement>("#comment-text");
const messageElement = document.querySelector<HTMLElement>("#comment-message");

const MAX_LENGTH = 500;

function formatDate(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

// Build each comment with textContent (never innerHTML) so typed HTML is shown as plain text
function commentElement(comment: ProductComment) {
  const item = document.createElement("li");
  item.className = "comment";

  const header = document.createElement("p");
  header.className = "comment__meta";
  const author = document.createElement("strong");
  author.textContent = comment.author || "Anonymous";
  const date = document.createElement("time");
  date.dateTime = comment.createdAt;
  date.textContent = formatDate(comment.createdAt);
  header.append(author, " · ", date);

  const text = document.createElement("p");
  text.className = "comment__text";
  text.textContent = comment.text;

  item.append(header, text);
  return item;
}

function showMessage(text: string) {
  if (messageElement) messageElement.textContent = text;
}

async function renderComments() {
  if (!productId || !listElement) return;
  try {
    const comments = await getComments(productId);
    if (countElement) countElement.textContent = `(${comments.length})`;

    if (comments.length === 0) {
      const empty = document.createElement("li");
      empty.className = "comment comment--empty";
      empty.textContent = "No comments yet. Be the first to share your thoughts!";
      listElement.replaceChildren(empty);
    } else {
      listElement.replaceChildren(...comments.map(commentElement));
    }
  } catch (error) {
    console.error("Unable to load comments", error);
    const failed = document.createElement("li");
    failed.className = "comment comment--empty";
    failed.textContent = "Comments could not be loaded.";
    listElement.replaceChildren(failed);
  }
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!productId || !nameInput || !textInput) return;

  const author = nameInput.value.trim();
  const text = textInput.value.trim();

  if (!author || !text) {
    showMessage("Please enter your name and a comment.");
    return;
  }
  if (text.length > MAX_LENGTH) {
    showMessage(`Comments can be up to ${MAX_LENGTH} characters.`);
    return;
  }

  const submitButton = form.querySelector<HTMLButtonElement>("button[type=submit]");
  if (submitButton) submitButton.disabled = true;
  try {
    await addComment(productId, author, text);
    textInput.value = "";
    showMessage("Thanks! Your comment was posted.");
    await renderComments();
  } catch (error) {
    console.error("Unable to post comment", error);
    showMessage("Your comment could not be posted. Please try again.");
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
});

// Fill in the name for signed-in users
if (nameInput && !nameInput.value) nameInput.value = getSignedInName();

renderComments();