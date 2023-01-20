class Controls{
    constructor(type, offset){
        this.forward = false;
        this.right = false;
        this.reverse = false;
        this.left = false;

        switch(type){
            case "KEYS":
                // this.#keyboardListeners();
                this.forward = true;
                break;
            case "DUMMY":
                this.forward = true;
                break;
        }
    }

    #keyboardListeners(){
        document.onkeydown = (event) => {
            switch(event.key){
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "ArrowRight":
                    this.right = true;
                    break;
                case "ArrowUp":
                    this.forward = true;
                    break;
                case "ArrowDown":
                    this.reverse = true;
                    break;
            }
        }

        document.onkeyup = (event) => {
            switch(event.key){
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "ArrowRight":
                    this.right = false;
                    break;
                case "ArrowUp":
                    this.forward = false;
                    break;
                case "ArrowDown":
                    this.reverse = false;
                    break;
            }
        }
    }
}