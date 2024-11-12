import { useCallback, useEffect, useState } from "react";

let initialState = {
    "rows": [
        {
            "id": "electronics",
            "label": "Electronics",
            "value": 1400,
            "children": [
                {
                    "id": "phones",
                    "label": "Phones",
                    "value": 800
                },
                {
                    "id": "laptops",
                    "label": "Laptops",
                    "value": 700
                }
            ]
        },
        {
            "id": "furniture",
            "label": "Furniture",
            "value": 1000,
            "children": [
                {
                    "id": "tables",
                    "label": "Tables",
                    "value": 300
                },
                {
                    "id": "chairs",
                    "label": "Chairs",
                    "value": 700
                }
            ]
        }
    ]
}
export default function HierarchyTable() {
    const [data, setData] = useState();

    useEffect(() => {
        let updatedState = initialState;
        updatedState.rows.map(item => {
            item.input = "";
            item.variance = "0";
            item = item.children.map(item1 => {
                item1.input = "";
                item1.variance = "0";
                return item1
            })
            return item;
        })
        setData(updatedState);
    }, []);

    const handleInput = (e, index) => {
        setData(prev => ((
            {
                ...prev,
                rows: prev.rows.map((item, i) => {
                    if (i == index)
                        item["input"] = e.target.value;
                    return item;
                })
            }
        )));
    }

    const handleInput1 = (e, index, index1) => {
        let payload = data;
        setData(prev => ((
            {
                ...prev,
                rows: prev.rows.map((item, i) => {
                    if (i == index)
                        item["children"][index1]["input"] = e.target.value;
                    return item;
                })
            }
        )));
    }

    const incrementParent = useCallback((e, index, name) => {
        var updated = false;
        if (name == "allocationperc") {
            setData(prev => (
                {
                    ...prev,
                    rows: [...prev.rows].map((item, i) => {
                        if (i == index && updated == false) {
                            updated = true;
                            item["variance"] = 100;
                            item["value"] = item["value"] + (parseInt(item["value"]) / 100) * parseInt(item["input"]);
                        }

                        return item;
                    })
                }
            ));
        }
        if (name == "allocationval") {
            setData(prev => (
                {
                    ...prev,
                    rows: [...prev.rows].map((item, i) => {
                        if (i == index && updated == false) {
                            updated = true;
                            item["variance"] = ((parseInt(item["value"]) + parseInt(item["input"])) - parseInt(item["value"]) / 100) * 100;
                            item["value"] = parseInt(item["value"]) + parseInt(item["input"]);

                        }

                        return item;
                    })
                }
            ));
        }
    })

    const incrementChild = (e, index, index1, name) => {
        var updated = false;
        if (name == "allocationperc") {
            setData(prev => ((
                {
                    ...prev,
                    rows: prev.rows.map((item, i) => {
                        if (i == index && updated == false) {
                            updated = true;
                            item["children"][index1]["variance"] = parseInt(item["children"][index1]["value"]).toFixed(2);
                            item["variance"] = ((((parseInt(item["children"][index1]["value"]) / 100) * parseInt(item["children"][index1]["input"])) / parseInt(item["value"])) * 100).toFixed(2);
                            item["children"][index1]["value"] = parseInt(item["children"][index1]["value"]) + ((parseInt(item["children"][index1]["value"]) / 100) * parseInt(item["children"][index1]["input"]));
                            item["value"] = item["value"] + parseInt(item["children"][index1]["input"]);
                        }

                        return item;
                    })
                }
            )));
        }
        if (name == "allocationval") {
            setData(prev => ((
                {
                    ...prev,
                    rows: prev.rows.map((item, i) => {
                        if (i == index && updated == false) {
                            updated = true;
                            item["children"][index1]["variance"] = ((parseInt(item["children"][index1]["input"]) / parseInt(item["children"][index1]["value"])) * 100).toFixed(2);
                            item["children"][index1]["value"] = parseInt(item["children"][index1]["value"]) + parseInt(item["children"][index1]["input"]);
                            item["variance"] = ((parseInt(item["children"][index1]["input"]) / parseInt(item["value"])) * 100).toFixed(2);
                            item["value"] = item["value"] + parseInt(item["children"][index1]["input"]);
                        }
                        return item;
                    })
                }
            )));
        }

    }
    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Label</th>
                        <th>Value</th>
                        <th>Input</th>
                        <th>Allocation %</th>
                        <th>Allocation Val</th>
                        <th>Variance %</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.rows.map((item, index) => (
                        <>
                            <tr>
                                <td>{item.label}</td>
                                <td>{item.value}</td>
                                <td><input type="number" value={item.input ?? ""} onChange={e => handleInput(e, index)} /> </td>
                                <td><button onClick={e => incrementParent(e, index, "allocationperc")}>Increment by %</button></td>
                                <td><button onClick={e => incrementParent(e, index, "allocationval")}>Increment by Val</button></td>
                                <td>{item.variance ?? "0"} %</td>
                            </tr>
                            {
                                item.children && item.children.length > 0 && item.children.map((item1, index1) => (
                                    <tr>
                                        <td>--{item1.label}</td>
                                        <td>{item1.value}</td>
                                        <td><input type="number" value={item1.input ?? ""} onChange={e => handleInput1(e, index, index1)} /> </td>
                                        <td><button onClick={e => incrementChild(e, index, index1, "allocationperc")}>Increment by %</button></td>
                                        <td><button onClick={e => incrementChild(e, index, index1, "allocationval")}>Increment by Val</button></td>
                                        <td>{item1.variance ?? "0"} %</td>
                                    </tr>
                                ))
                            }
                        </>
                    ))}
                </tbody>
            </table>
        </>
    );
}