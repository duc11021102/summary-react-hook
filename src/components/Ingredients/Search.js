import React from "react";
import { useState, useEffect } from "react";
import Card from "../UI/Card";
import "./Search.css";
import { useRef } from "react";

const Search = React.memo((props) => {
  const [enteredFilter, setEnteredFilter] = useState("");
  const { onLoadIngredients } = props;
  const inputRef = useRef();

  useEffect(() => {
    /**
     * setTimeout có nhiệm vụ lấy dữ liệu từ cơ sở dữ 
     * liệu Firebase dựa trên một giá trị đã nhập (enteredFilter) 
     * sau khi đã chờ 500ms để tránh gửi nhiều yêu cầu tới server
     *  khi người dùng đang tiếp tục nhập liệu.
     * 
     * hàm if là một hàm điều kiện kiểm tra. Nó kiểm tra xem giá trị của enteredFilter 
     * có giống với giá trị hiện tại của tham chiếu inputRef hay không. Nếu hai giá trị 
     * này giống nhau, tiếp tục thực hiện các bước trong block lệnh.
     * 
     * khi vẫn đang trong quá trình nhập dữ liệu thì hàm if trả về false , khi nhập 
     * xong trả về true thì sẽ đợi 500ms rồi thực hiện các lệnh trong block 
     */

    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query =
          enteredFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
        fetch(
          "https://react-hook-80098-default-rtdb.firebaseio.com/ingredients.json" +
          query
        ).then((response) => response.json())
          .then((responseData) => {
            const loadedIngredients = [];
            for (const key in responseData) {
              loadedIngredients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount,
              });
            }
            onLoadIngredients(loadedIngredients);
          });
      }
    }, 500);
    return ()=>{
      clearTimeout(timer);
    }
  }, [enteredFilter, onLoadIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={(event) => {
              setEnteredFilter(event.target.value);
            }}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
