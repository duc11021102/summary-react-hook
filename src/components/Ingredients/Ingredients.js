import React, { useState, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();


  // useCallback giúp tạo lại hàm chỉ khi cần thiết và giữ nó không thay đổi giữa các lần re-render.
  // mỗi lần component thay đổi thì sẽ tạo lại hàm và chạy lại hàm từ đầu điều này sẽ không cần thiết nên sẽ sử dụng useCallback
  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setIngredients(filteredIngredients);
  }, []);

  const onAddIngredientHandler = (ingredient) => {
    setIsLoading(true);
    fetch(
      "https://react-hook-80098-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        // mode: "no-cors",
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => {
        setIsLoading(false);
        return response.json();
      })
      .then((responseData) => {
        setIngredients((prev) => [
          ...prev,
          { id: responseData.name, ...ingredient },
        ]);
      });
  };
  const onRemoveItemHandler = (id) => {
    setIsLoading(true);
    fetch(`https://react-hook-80098-default-rtdb.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
    }).then((response) => {
      setIsLoading(false);
      const newIngredients = ingredients.filter((item) => item.id !== id);
      setIngredients(newIngredients);
    }).catch((error) => {
      setError('Something went wrong');
    })
  };

  const onCloseHandler = () => {
    setError(null);
    setIsLoading(false);
  }
  return (
    <div className="App">
      {error && <ErrorModal onClose={onCloseHandler}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={onAddIngredientHandler} isLoading={isLoading} />
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          onRemoveItem={onRemoveItemHandler}
          ingredients={ingredients}
        />
      </section>
    </div>
  );
}

export default Ingredients;
