import random
import re
import sys


class Wordle_board:
    def __init__(self, word=None):
        self.word_list = self.load_words("wordlist.txt")
        self.answer_list = self.load_words("answerlist.txt")
        self.word = word if word is not None else random.choice(self.answer_list)
        self.letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l",
                        "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
        self.board = []
        self.attempts = 0

    def __str__(self):
        current_board = ""
        for set in self.board:
            current_board += f"{set[0]}\n"
            current_board += f"{set[1]}\n"
        current_board += f"Letters left: {self.letters}"
        return current_board

    @property
    def word(self):
        return self._word

    @word.setter
    def word(self, word):
        if len(word) != 5 or word not in self.word_list:
            raise ValueError
        self._word = word

    @staticmethod
    def load_words(file_name):
        words = []
        with open(file_name, "r") as file:
            for line in file:
                line = line.rstrip()
                words.append(line)
        return words

    def get_guess(self, guess):
        while True:
            match guess:
                case "-b" | "--board":
                    return "-b"
                    # gen_board()
                case "-w" | "--word":
                    return "-w"
                case _:
                    if len(guess.strip()) != 5:
                        print("Error: needs exacaly 5 character word")
                        return "ERROR!"
                    if _ := re.search(r"^[a-z]{5}$", guess, re.I):
                        if guess not in self.word_list:
                            print("not a real word")
                            return "ERROR!"
                        else:
                            self.attempts += 1
                            return guess

    # do one pass for grean then do the rest
    def validate(self, guess):
        split_guess = list(guess)
        split_word = list(self.word)
        color_validation = ["", "", "", "", ""]
        for i, letter in enumerate(split_guess):
            if letter == split_word[i]:
                color_validation[i] = "🟩"
                split_word[i] = "#"
                split_guess[i] = "#"

        for i, letter in enumerate(split_guess):
            if letter == "#":
                continue
            elif letter in split_word:
                color_validation[i] = "🟨"
                split_guess[i] = "#"
                split_word[split_word.index(letter)] = "#"
            else:
                color_validation[i] = "🟥"
                if letter in self.letters:
                    self.letters.remove(letter)

        formated_guess = [f" {letter}" for letter in list(guess)]
        self.board.append([formated_guess, color_validation])
        return color_validation

    def game_over(self, guess):
        if self.word == guess:
            return f"you win!\nAttempts: {self.attempts}"

        else:
            return f"you lose\nThe word was {self.word}"


def main():
    board = Wordle_board()

    # welcome prompt
    print("welcome to worldle type a 5 letter real word to guess")
    print("🟩 is correct postions and letter\n🟨 is correct letter wrong posstion\n🟥 is wrong letter entirely")
    print("Use -b or --board to bring up the current board and letters available\nOr use -w or --word to bring up the word*cheating!")

    while True:
        # prompt user for guess
        while True:
            guess = board.get_guess(input("Guess: "))
            match guess:
                case "-w":
                    print(board.word)
                case "-b":
                    print(board)
                case "ERROR!":
                    ...
                case _:
                    break

        # compare input word
        board.validate(guess)

        # output board plus letters remaining
        print(board)

        # game over check
        if guess == board.word or board.attempts == 6:
            print(board.game_over(guess))
            sys.exit()


if __name__ == "__main__":
    main()
