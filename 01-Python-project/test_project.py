from project import Wordle_board
import pytest


def test__init__():
    board = Wordle_board()
    assert board
    board2 = Wordle_board("hello")
    assert board2.word == "hello"


def test__str__():
    board = Wordle_board("drone")
    assert str(
        board) == "Letters left: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']"
    board.validate("hello")
    assert str(board) == """[' h', ' e', ' l', ' l', ' o']
['🟥', '🟨', '🟥', '🟥', '🟨']
Letters left: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'i', 'j', 'k', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']"""


def test_word():
    board = Wordle_board("hello")
    assert board.word == "hello"
    board.word = "world"
    assert board.word == "world"
    with pytest.raises(ValueError):
        board.word = "helloo"
    with pytest.raises(ValueError):
        board.word = "helo"
    with pytest.raises(ValueError):
        board.word = "abcde"


def test_load_words():
    board = Wordle_board()
    assert len(board.word_list) > 0
    assert len(board.answer_list) > 0


def test_get_guess():
    board = Wordle_board()
    assert board.get_guess("hello") == "hello"
    assert board.get_guess("-b") == "-b"
    assert board.get_guess("--board") == "-b"
    assert board.get_guess("-w") == "-w"
    assert board.get_guess("--word") == "-w"
    assert board.get_guess("helloo") == "ERROR!"
    assert board.get_guess("helo") == "ERROR!"
    assert board.get_guess("abcde") == "ERROR!"


def test_validate():
    board = Wordle_board("hello")
    assert board.validate("drone") == ["🟥", "🟥", "🟨", "🟥", "🟨"]
    assert board.validate("apple") == ["🟥", "🟥", "🟥", "🟩", "🟨"]
    assert board.validate("world") == ["🟥", "🟨", "🟥", "🟩", "🟥"]


def test_validate_corners():
    board = Wordle_board("pleas")
    assert board.validate("pleas") == ["🟩", "🟩", "🟩", "🟩", "🟩"]
    assert board.validate("sleep") == ["🟨", "🟩", "🟩", "🟥", "🟨"]
    assert board.validate("apple") == ["🟨", "🟨", "🟥", "🟨", "🟨"]
    assert board.validate("wrong") == ["🟥", "🟥", "🟥", "🟥", "🟥"]


def test_game_over():
    board = Wordle_board("hello")
    assert board.game_over("world") == f"you lose\nThe word was {board.word}"
    assert board.game_over("hello") == f"you win!\nAttempts: {board.attempts}"
