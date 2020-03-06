#!/usr/bin/env python3
"""
clean ../v2/data/locations.json
"""
import json

class CleanJson(object):
    def __init__(self):
        pass

    def write_data(self, data):
        with open("../v2/data/locations-modified.json", "a", encoding="utf-8") as open_file:
            json.dump(data, open_file, indent=2, separators=(',', ': '))


    def get_data(self):
        with open("../v2/data/locations.json", "r", encoding="utf-8") as json_file:
            data = json.load(json_file)
        return data


    def do_clean(self, data):
        for i, location in enumerate(data):
            if location['id'] != i + 1:
                return i
        return None


    def execute(self):
        data = self.get_data()
        while True:
            missing = self.do_clean(data)
            print("missing {}".format(missing))
            if missing is None:
                return self.write_data(data)
            else:
                data.insert(missing, data.pop(-1))
                data[missing]['id'] = missing + 1
            

if __name__ == "__main__":
    tester = CleanJson()
    tester.execute()
