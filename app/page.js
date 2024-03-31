import styles from "./page.module.css";
import Header from "./components/header/header";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const isFirstRender = useRef(true);

  // Liste des taches en cours
  const [list, setlist] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Liste des taches fini
  const [finish, setFinish] = useState([]);

  // mode edition
  const [editItemId, setEditItemId] = useState(null);

  // nouveau nom de task en cas de modification
  const [newValue, setNewValue] = useState("");

  // Fonction pour activer le mode édition pour un élément spécifique
  const enableEditMode = (id) => {
    setEditItemId(id);
  };

  // Gestionnaire d'événement pour mettre à jour le nouveau nom de task
  const handleInputChange = (event) => {
    setNewValue(event.target.value);
  };

  // Fonction pour déplacer l'élément vers le haut
  const moveItemUp = (id) => {
    const currentIndex = list.findIndex(item => item.id === id);
    if (currentIndex > 0) {
      const newList = [...list];
      const temp = newList[currentIndex];
      newList[currentIndex] = newList[currentIndex - 1];
      newList[currentIndex - 1] = temp;
      setlist(newList);
    }
  };

  // Fonction pour déplacer l'élément vers le bas
  const moveItemDown = (id) => {
    const currentIndex = list.findIndex(item => item.id === id);
    if (currentIndex < list.length - 1) {
      const newList = [...list];
      const temp = newList[currentIndex];
      newList[currentIndex] = newList[currentIndex + 1];
      newList[currentIndex + 1] = temp;
      setlist(newList);
    }
  };

  // Fonction pour désactiver le mode édition
  const disableEditMode = (id) => {
    const foundIndex = list.findIndex(x => x.id === id); // Trouve l'index de l'élément dans la liste
    if (foundIndex !== -1) { // Vérifie si l'élément a été trouvé
      const updatedItems = [...list]; // Crée une copie de la liste d'éléments
      updatedItems[foundIndex].task = newValue; // Modifie la propriété task de l'élément avec la nouvelle valeur
      setlist(updatedItems); // Met à jour la liste avec l'élément modifié
      setEditItemId(null); // Réinitialise editItemId à null pour sortir du mode édition
    }
  };
  
  // template task / mode edition et mode normal
  const template = (item) => {
    if(editItemId === item.id) {
      return (
        <li key={item.id} className={styles.li}>
          <input type="text" defaultValue={item.task} onChange={handleInputChange}></input>
          <div>
            <span onClick={() => moveItemUp(item.id)} className="material-symbols-outlined">expand_less</span>
            <span onClick={() => moveItemDown(item.id)} className="material-symbols-outlined">expand_more</span>
            <span onClick={() => disableEditMode(item.id)} className="material-symbols-outlined">done</span>
          </div>
        </li>
        )
    } else {
      return (
        <li key={item.id} className={styles.li}>
          {item.task}
          <div>
            <span onClick={() => addFinish(item.id)} className="material-symbols-outlined">done</span>
            <span onClick={() => enableEditMode(item.id)} className="material-symbols-outlined">edit</span>
            <span onClick={() => deleteTask(item.id)} className="material-symbols-outlined">delete</span>
          </div>
        </li>
        )
    }
  };

  // ajout d'une nouvelle task
  const addTask = () => {
    if (!newTask) return;
    setlist([{ id: list.length + 1, task: newTask }, ...list]);
    setNewTask("");
  };

  // suppression d'un task en cours
  const deleteTask = (id) => {
    const newList = list.filter((item) => item.id != id);
    setlist(newList);
  };

  const addFinish = (id) => {
    // Nous allons d'abord chercher la task
    const task = list.find((item) => item.id === id);

    // Stockage de la task dans la liste des tasks fini
    setFinish((prevFinish) => [
      { id: prevFinish.length + 1, task: task.task },
      ...prevFinish,
    ]);

    // Mise a jours de la liste des task a faire
    setlist((prevList) => prevList.filter((item) => item.id !== id));
  };

  // suppression d'un task fini
  const deleteTaskFinish = (id) => {
    const newList = finish.filter((item) => item.id != id);
    setFinish(newList);
  };

  // recuperation des task dans le local storage de l'utilisateur
  useEffect(() => {
    // Récupérer la liste en cours depuis le LocalStorage
    const storedList = JSON.parse(localStorage.getItem("list"));
    if (storedList) {
      setlist(storedList);
    }
    // Récupérer la liste des tâches terminées depuis le LocalStorage
    const storedFinish = JSON.parse(localStorage.getItem("finish"));
    if (storedFinish) {
      setFinish(storedFinish);
    }
  }, []);

  // enregistrement des liste de task lors d'un changement 
  useEffect(() => {
    // Fonction de sauvegarde des listes dans le LocalStorage
    const saveListsToLocalStorage = () => {
      localStorage.setItem("list", JSON.stringify(list));
      localStorage.setItem("finish", JSON.stringify(finish));
    };

    // Vérifier si c'est le premier rendu
    if (isFirstRender.current) {
      isFirstRender.current = false; // Mettre à jour pour indiquer que ce n'est pas le premier rendu
    } else {
      // Appeler la fonction de sauvegarde chaque fois que les listes changent
      saveListsToLocalStorage();
    }
  }, [list, finish]); // Effect déclenché à chaque changement de list ou finish

  return (
    <main>
      <Header></Header>
      <div className={styles.tab}>
        <div className={styles.addTodo}>
          <input
            className={styles.input}
            type="text"
            placeholder="Enter Task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          ></input>
          <button className={styles.button} onClick={addTask}>
            add
          </button>
        </div>

        <div className={styles.divListTodo} style={list.length > 0 ? { display: "flex" } : { display: "none" }}>
          <ul className={styles.liste}>
            {list.map((item) => (
              template(item)
            ))}
          </ul>
        </div>

        <div
          className={styles.separator}
          style={finish.length > 0 ? { display: "flex" } : { display: "none" }}
        ></div>

        <div
          className={styles.divListTodo}
          style={finish.length > 0 ? { display: "flex" } : { display: "none" }}
        >
          <ul className={styles.liste}>
            {finish.map((item) => (
              <li key={item.id} className={styles.lifinish}>
                {item.task}
                <div>
                  <span
                    onClick={() => deleteTaskFinish(item.id)}
                    className="material-symbols-outlined">
                    delete
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
