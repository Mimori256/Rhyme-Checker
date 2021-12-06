import json
file_name = "cmudict"
pronounciation_dict = {}

with open(file_name, "r") as f:
    word_list = f.read().split("\n")

for word in word_list:
    try:
        word = word.replace("  ", " ")
        word = word.split()
        pronounciation_dict[word[0]] = word[1:]
    except:
        continue

with open("pronounce_data.json", "w") as f:
    json.dump(pronounciation_dict, f, ensure_ascii=False)

print("complete")
