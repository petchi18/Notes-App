const addBox = document.querySelector(".add-box"),
  popupBox = document.querySelector(".popup-box"),
  popupTitle = popupBox.querySelector("header p"),
  closeIcon = popupBox.querySelector("header i"),
  titleTag = popupBox.querySelector("input"),
  descTag = popupBox.querySelector("textarea"),
  addBtn = popupBox.querySelector("button"),
  imageInput = popupBox.querySelector("#imageInput"); // Image input element

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false,
  updateId;

const imageViewer = document.querySelector(".image-viewer");
const imageView = imageViewer.querySelector("img");
const closeImageView = imageViewer.querySelector(".close-image");

addBox.addEventListener("click", () => {
  popupTitle.innerText = "Add a new Note";
  addBtn.innerText = "Add Note";
  popupBox.classList.add("show");
  document.querySelector("body").style.overflow = "hidden";
  if (window.innerWidth > 660) titleTag.focus();
});

closeIcon.addEventListener("click", () => {
  isUpdate = false;
  titleTag.value = descTag.value = "";
  imageInput.value = ""; // Clear image input when closing the popup
  popupBox.classList.remove("show");
  document.querySelector("body").style.overflow = "auto";
});

function showImage(imageUrl) {
  imageView.src = imageUrl;
  imageViewer.style.display = "flex";
}

function closeImage() {
  imageView.src = "";
  imageViewer.style.display = "none";
}

closeImageView.addEventListener("click", closeImage);

function showNotes() {
  if (!notes) return;
  document.querySelectorAll(".note").forEach((li) => li.remove());
  notes.forEach((note, id) => {
    let filterDesc = note.description.replaceAll("\n", "<br/>");
    let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        ${
                          note.image
                            ? `<i class="uil uil-eye view-image"></i>`
                            : ""
                        }
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, '${
      note.title
    }', '${filterDesc}', '${
      note.image || ""
    }')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
    addBox.insertAdjacentHTML("afterend", liTag);
  });

  const viewImageIcons = document.querySelectorAll(".view-image");
  viewImageIcons.forEach((icon, index) => {
    icon.addEventListener("click", () => {
      const imageUrl = notes[index].image;
      if (imageUrl) {
        showImage(imageUrl);
      }
    });
  });
}

showNotes();

function showMenu(elem) {
  elem.parentElement.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

function deleteNote(noteId) {
  let confirmDel = confirm("Are you sure you want to delete this note?");
  if (!confirmDel) return;
  notes.splice(noteId, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  showNotes();
}

function updateNote(noteId, title, filterDesc, image) {
  let description = filterDesc.replaceAll("<br/>", "\r\n");
  updateId = noteId;
  isUpdate = true;
  addBox.click();
  titleTag.value = title;
  descTag.value = description;
  popupTitle.innerText = "Update a Note";
  addBtn.innerText = "Update Note";
  imageInput.value = ""; // Clear image input when updating the note
}

addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let title = titleTag.value.trim();
  let description = descTag.value.trim();
  let image = null;

  if (title || description) {
    let currentDate = new Date();
    let month = months[currentDate.getMonth()];
    let day = currentDate.getDate();
    let year = currentDate.getFullYear();

    // Get the image URL from the image input
    const imageFile = imageInput.files[0];
    if (imageFile) {
      image = URL.createObjectURL(imageFile);
    }

    let noteInfo = {
      title,
      description,
      image,
      date: `${month} ${day}, ${year}`,
    };
    if (!isUpdate) {
      notes.push(noteInfo);
    } else {
      isUpdate = false;
      notes[updateId] = noteInfo;
    }
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
    closeIcon.click();
  }
});
