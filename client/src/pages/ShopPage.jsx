import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import BreadCrumb from '../components/BreadCrumb'

import { getMaincategory } from "../Redux/ActionCreators/MaincategoryActionCreators"
import { getSubcategory } from "../Redux/ActionCreators/SubcategoryActionCreators"
import { getBrand } from "../Redux/ActionCreators/BrandActionCreators"
import { getProduct } from "../Redux/ActionCreators/ProductActionCreators"
import ProductCard from '../components/ProductCard'
import { useSearchParams } from 'react-router-dom'
export default function ShopPage() {
    let [search, setSearch] = useState("")
    let [sortFilter, setSortFilter] = useState("1")
    let [product, setProduct] = useState([])

    let [selectedMaincategory, setSelectedMaincategory] = useState([])
    let [selectedSubcategory, setSelectedSubcategory] = useState([])
    let [selectedBrand, setSelectedBrand] = useState([])

    let [selectedColor, setSelectedColor] = useState([])
    let [selectedSize, setSelectedSize] = useState([])

    let [flag, setFlag] = useState(false)

    let [searchParams] = useSearchParams()

    let [min, setMin] = useState(0)
    let [max, setMax] = useState(1000)


    let MaincategoryStateData = useSelector(state => state.MaincategoryStateData)
    let SubcategoryStateData = useSelector(state => state.SubcategoryStateData)
    let BrandStateData = useSelector(state => state.BrandStateData)
    let ProductStateData = useSelector(state => state.ProductStateData)
    let dispatch = useDispatch()

    function searchFilter(e) {
        e.preventDefault()
        let ch = search.toLocaleLowerCase()
        let data = ProductStateData.filter(x => x.active && (
            x?.name?.toLocaleLowerCase().includes(ch)) ||
            x?.maincategory?.name?.toLocaleLowerCase() === ch ||
            x?.subcategory?.name?.toLocaleLowerCase() === ch ||
            x?.brand?.name?.toLocaleLowerCase() === ch ||
            x?.color?.includes(ch) ||
            x?.description?.includes(ch)
        )
        if (sortFilter === "1")
            setProduct(data.sort((x, y) => y._id.localeCompare(x._id)))
        else if (sortFilter === "2")
            setProduct(data.sort((x, y) => y.discount - x.discount))
        else if (sortFilter === "3")
            setProduct(data.sort((x, y) => y.finalPrice - x.finalPrice))
        else
            setProduct(data.sort((x, y) => x.finalPrice - y.finalPrice))
    }

    function applySortFilter(option) {
        setSortFilter(option)
        if (option === "1")
            setProduct(product.sort((x, y) => y._id.localeCompare(x._id)))
        else if (option === "2")
            setProduct(product.sort((x, y) => y.discount - x.discount))
        else if (option === "3")
            setProduct(product.sort((x, y) => y.finalPrice - x.finalPrice))
        else
            setProduct(product.sort((x, y) => x.finalPrice - y.finalPrice))
    }

    function isInclude(arr1, arr2) {
        let flag = false
        for (let item of arr1) {
            if (arr2.includes(item)) {
                flag = true
                break
            }
        }
        return flag
    }
    function applyfilter(mc, sc, br, color, size, min = -1, max = -1) {
        let data = ProductStateData.filter(x => x.active &&
            (mc.length === 0 || mc.includes(x.maincategory?.name)) &&
            (sc.length === 0 || sc.includes(x.subcategory?.name)) &&
            (br.length === 0 || br.includes(x.brand?.name)) &&
            (color.length === 0 || isInclude(color, x.color)) &&
            (size.length === 0 || isInclude(size, x.size)) &&
            (min === -1 || (x.finalPrice >= min && x.finalPrice <= max))
        )
        if (sortFilter === "1")
            setProduct(data.sort((x, y) => y._id.localeCompare(x._id)))
        else if (sortFilter === "2")
            setProduct(data.sort((x, y) => y.discount - x.discount))
        else if (sortFilter === "3")
            setProduct(data.sort((x, y) => y.finalPrice - x.finalPrice))
        else
            setProduct(data.sort((x, y) => x.finalPrice - y.finalPrice))
    }
    function selectCollection(collection) {
        if (collection === "maincategory")
            return selectedMaincategory
        else if (collection === "subcategory")
            return selectedSubcategory
        else if (collection === "brand")
            return selectedBrand
        else if (collection === "color")
            return selectedColor
        else if (collection === "size")
            return selectedSize
    }
    function filter(collection, value) {
        let data = selectCollection(collection)
        if (data.includes(value)) {
            let index = data.indexOf(value)
            data.splice(index, 1)
        }
        else
            data.push(value)

        setFlag(!flag)
        if (collection === "maincategory") {
            setSelectedMaincategory(data)
            applyfilter(data, selectedSubcategory, selectedBrand, selectedColor, selectedSize)
        }
        else if (collection === "subcategory") {
            setSelectedSubcategory(data)
            applyfilter(selectedMaincategory, data, selectedBrand, selectedColor, selectedSize)
        }
        else if (collection === "brand") {
            setSelectedBrand(data)
            applyfilter(selectedMaincategory, selectedSubcategory, data, selectedColor, selectedSize)
        }
        else if (collection === "color") {
            setSelectedColor(data)
            applyfilter(selectedMaincategory, selectedSubcategory, selectedBrand, data, selectedSize)
        }
        else if (collection === "size") {
            setSelectedSize(data)
            applyfilter(selectedMaincategory, selectedSubcategory, selectedBrand, selectedColor, data)
        }
    }


    useEffect(() => {
        (() => {
            dispatch(getMaincategory())
        })()
    }, [MaincategoryStateData.length])

    useEffect(() => {
        (() => {
            dispatch(getSubcategory())
        })()
    }, [SubcategoryStateData.length])

    useEffect(() => {
        (() => {
            dispatch(getBrand())
        })()
    }, [BrandStateData.length])

    useEffect(() => {
        (() => {
            dispatch(getProduct())
            let mc = searchParams.get("mc") ? [searchParams.get("mc")] : []
            let sc = searchParams.get("sc") ? [searchParams.get("sc")] : []
            let br = searchParams.get("br") ? [searchParams.get("br")] : []

            setSelectedMaincategory(mc)
            setSelectedSubcategory(sc)
            setSelectedBrand(br)
            if (ProductStateData.length) {
                applyfilter(mc, sc, br, selectedColor, selectedSize)
            }
        })()
    }, [ProductStateData.length, searchParams])
    return (
        <>
            <div className="page-content">
                <BreadCrumb title="Shop" />

                <section className="py-4">
                    <h5 className="mb-0 fw-bold d-none">Product Grid</h5>
                    <div className="container-fluid">
                        <div className="btn btn-dark btn-ecomm d-xl-none position-fixed top-50 start-0 translate-middle-y" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbarFilter"><span><i className="bi bi-funnel me-1"></i> Filters</span></div>
                        <div className="row">
                            <div className="col-12 col-xl-2 filter-column">
                                <nav className="navbar navbar-expand-xl flex-wrap p-0">
                                    <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasNavbarFilter" aria-labelledby="offcanvasNavbarFilterLabel">
                                        <div className="offcanvas-header">
                                            <h5 className="offcanvas-title mb-0 fw-bold" id="offcanvasNavbarFilterLabel">Filters</h5>
                                            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                        </div>
                                        <div className="offcanvas-body">
                                            <div className="filter-sidebar">
                                                <div className="card rounded-0">
                                                    <div className="card-header d-none d-xl-block bg-transparent">
                                                        <h5 className="mb-0 fw-bold">Filters</h5>
                                                    </div>
                                                    <div className="card-body">
                                                        <h6 className="p-1 fw-bold bg-light">Maincategory</h6>
                                                        <div className="categories">
                                                            <div className="categories-wrapper height-1 p-1">
                                                                {
                                                                    MaincategoryStateData.filter(x => x.active).map(item => {
                                                                        return <div className="form-check" key={item._id}>
                                                                            <input className="form-check-input" type="checkbox" id={`${item.name}`} checked={selectedMaincategory.includes(item.name)} onChange={() => filter("maincategory", item.name)} />
                                                                            <label className="form-check-label" htmlFor={`${item.name}`}>
                                                                                <span>{item.name}</span>
                                                                            </label>
                                                                        </div>
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <h6 className="p-1 fw-bold bg-light">Subcategory</h6>
                                                        <div className="categories">
                                                            <div className="categories-wrapper height-1 p-1">
                                                                {
                                                                    SubcategoryStateData.filter(x => x.active).map(item => {
                                                                        return <div className="form-check" key={item._id}>
                                                                            <input className="form-check-input" type="checkbox" id={`${item.name}`} checked={selectedSubcategory.includes(item.name)} onChange={() => filter("subcategory", item.name)} />
                                                                            <label className="form-check-label" htmlFor={`${item.name}`}>
                                                                                <span>{item.name}</span>
                                                                            </label>
                                                                        </div>
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <h6 className="p-1 fw-bold bg-light">Brand</h6>
                                                        <div className="categories">
                                                            <div className="categories-wrapper height-1 p-1">
                                                                {
                                                                    BrandStateData.filter(x => x.active).map(item => {
                                                                        return <div className="form-check" key={item._id}>
                                                                            <input className="form-check-input" type="checkbox" id={`${item.name}`} checked={selectedBrand.includes(item.name)} onChange={() => filter("brand", item.name)} />
                                                                            <label className="form-check-label" htmlFor={`${item.name}`}>
                                                                                <span>{item.name}</span>
                                                                            </label>
                                                                        </div>
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <hr />
                                                        <div className="Price">
                                                            <h6 className="p-1 fw-bold bg-light">Price</h6>
                                                            <div className="Price-wrapper p-1">
                                                                <div className="input-group">
                                                                    <input type="text" className="form-control rounded-0" placeholder="Min. Amount" value={min} name='min' onChange={(e) => setMin(e.target.value)} />
                                                                    <span className="input-group-text bg-section-1 border-0">-</span>
                                                                    <input type="text" className="form-control rounded-0" placeholder="Max. Amount" value={max} name='max' onChange={(e) => setMax(e.target.value)} />
                                                                    <button type="button" className="btn btn-outline-dark rounded-0 ms-2" onClick={() => applyfilter(selectedMaincategory, selectedSubcategory, selectedBrand, selectedColor, selectedSize, min,max)}><i className="bi bi-chevron-right"></i></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className="colors">
                                                            <h6 className="p-1 fw-bold bg-light">Colors</h6>
                                                            <div>
                                                                <input className="form-check-input" type="checkbox" id="white" checked={selectedColor.includes("white")} onChange={() => filter("color", "white")} />
                                                                <label className="form-check-label ms-2" htmlFor="white">White</label>
                                                            </div>
                                                            <div>
                                                                <input className="form-check-input" type="checkbox" id="red" checked={selectedColor.includes("red")} onChange={() => filter("color", "red")} />
                                                                <label className="form-check-label ms-2" htmlFor="red">Red</label>
                                                            </div>
                                                            <div>
                                                                <input className="form-check-input" type="checkbox" id="green" checked={selectedColor.includes("green")} onChange={() => filter("color", "green")} />
                                                                <label className="form-check-label ms-2" htmlFor="green">Green</label>
                                                            </div>
                                                            <div>
                                                                <input className="form-check-input" type="checkbox" id="blue" checked={selectedColor.includes("blue")} onChange={() => filter("color", "blue")} />
                                                                <label className="form-check-label ms-2" htmlFor="blue">Blue</label>
                                                            </div>
                                                            <div>
                                                                <input className="form-check-input" type="checkbox" id="black" checked={selectedColor.includes("black")} onChange={() => filter("color", "black")} />
                                                                <label className="form-check-label ms-2" htmlFor="black">Black</label>
                                                            </div>

                                                            <div>
                                                                <input className="form-check-input" type="checkbox" id="gray" checked={selectedColor.includes("gray")} onChange={() => filter("color", "gray")} />
                                                                <label className="form-check-label ms-2" htmlFor="gray">Gray</label>
                                                            </div>
                                                            <div>
                                                                <input className="form-check-input" type="checkbox" id="yellow" checked={selectedColor.includes("yellow")} onChange={() => filter("color", "yellow")} />
                                                                <label className="form-check-label ms-2" htmlFor="yellow">Yellow</label>
                                                            </div>
                                                            <div>
                                                                <input className="form-check-input" type="checkbox" id="purple" checked={selectedColor.includes("purple")} onChange={() => filter("color", "purple")} />
                                                                <label className="form-check-label ms-2" htmlFor="purple">Purple</label>
                                                            </div>
                                                            <div>
                                                                <input className="form-check-input" type="checkbox" id="pink" checked={selectedColor.includes("pink")} onChange={() => filter("color", "pink")} />
                                                                <label className="form-check-label ms-2" htmlFor="pink">Pink</label>
                                                            </div>
                                                            <div>
                                                                <input className="form-check-input" type="checkbox" id="orange" checked={selectedColor.includes("orange")} onChange={() => filter("color", "orange")} />
                                                                <label className="form-check-label ms-2" htmlFor="orange">Orange</label>
                                                            </div>
                                                            <div>
                                                                <input className="form-check-input" type="checkbox" id="violet" checked={selectedColor.includes("violet")} onChange={() => filter("color", "violet")} />
                                                                <label className="form-check-label ms-2" htmlFor="violet">Violet</label>
                                                            </div>
                                                            <div>
                                                                <input className="form-check-input" type="checkbox" id="brown" checked={selectedColor.includes("brown")} onChange={() => filter("color", "brown")} />
                                                                <label className="form-check-label ms-2" htmlFor="brown">Brown</label>
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className="colors">
                                                            <h6 className="p-1 fw-bold bg-light">Size</h6>
                                                            <div>
                                                                <input className="form-check-input" type="checkbox" id="xxxl" checked={selectedSize.includes("xxxl")} onChange={() => filter("size", "xxxl")} />
                                                                <label className="form-check-label ms-2" htmlFor="xxxl">xxxl</label>
                                                            </div>
                                                            <div>
                                                                <input className="form-check-input" type="checkbox" id="xxl" checked={selectedSize.includes("xxl")} onChange={() => filter("size", "xxl")} />
                                                                <label className="form-check-label ms-2" htmlFor="xxl">xxl</label>
                                                            </div>
                                                            <div>
                                                                <input className="form-check-input" type="checkbox" id="xl" checked={selectedSize.includes("xl")} onChange={() => filter("size", "xl")} />
                                                                <label className="form-check-label ms-2" htmlFor="xl">xl</label>
                                                            </div>
                                                            <div>
                                                                <input className="form-check-input" type="checkbox" id="lg" checked={selectedSize.includes("lg")} onChange={() => filter("size", "lg")} />
                                                                <label className="form-check-label ms-2" htmlFor="lg">lg</label>
                                                            </div>
                                                            <div>
                                                                <input className="form-check-input" type="checkbox" id="md" checked={selectedSize.includes("md")} onChange={() => filter("size", "md")} />
                                                                <label className="form-check-label ms-2" htmlFor="md">md</label>
                                                            </div>

                                                            <div>
                                                                <input className="form-check-input" type="checkbox" id="sm" checked={selectedSize.includes("sm")} onChange={() => filter("size", "sm")} />
                                                                <label className="form-check-label ms-2" htmlFor="sm">sm</label>
                                                            </div>
                                                            <div>
                                                                <input className="form-check-input" type="checkbox" id="xs" checked={selectedSize.includes("xs")} onChange={() => filter("size", "xs")} />
                                                                <label className="form-check-label ms-2" htmlFor="xs">xs</label>
                                                            </div>
                                                            <div>
                                                                <input className="form-check-input" type="checkbox" id="24" checked={selectedSize.includes("24")} onChange={() => filter("size", "24")} />
                                                                <label className="form-check-label ms-2" htmlFor="24">24</label>
                                                            </div>
                                                            <div>
                                                                <input className="form-check-input" type="checkbox" id="26" checked={selectedSize.includes("26")} onChange={() => filter("size", "26")} />
                                                                <label className="form-check-label ms-2" htmlFor="26">26</label>
                                                            </div>
                                                            <div>
                                                                <input className="form-check-input" type="checkbox" id="28" checked={selectedSize.includes("28")} onChange={() => filter("size", "28")} />
                                                                <label className="form-check-label ms-2" htmlFor="28">28</label>
                                                            </div>
                                                            <div>
                                                                <input className="form-check-input" type="checkbox" id="30" checked={selectedSize.includes("30")} onChange={() => filter("size", "30")} />
                                                                <label className="form-check-label ms-2" htmlFor="30">30</label>
                                                            </div>
                                                            <div>
                                                                <input className="form-check-input" type="checkbox" id="32" checked={selectedSize.includes("32")} onChange={() => filter("size", "32")} />
                                                                <label className="form-check-label ms-2" htmlFor="32">32</label>
                                                            </div>
                                                            <div>
                                                                <input className="form-check-input" type="checkbox" id="34" checked={selectedSize.includes("34")} onChange={() => filter("size", "34")} />
                                                                <label className="form-check-label ms-2" htmlFor="34">34</label>
                                                            </div>
                                                            <div>
                                                                <input className="form-check-input" type="checkbox" id="36" checked={selectedSize.includes("36")} onChange={() => filter("size", "36")} />
                                                                <label className="form-check-label ms-2" htmlFor="36">36</label>
                                                            </div>
                                                            <div>
                                                                <input className="form-check-input" type="checkbox" id="38" checked={selectedSize.includes("38")} onChange={() => filter("size", "38")} />
                                                                <label className="form-check-label ms-2" htmlFor="38">38</label>
                                                            </div>
                                                            <div>
                                                                <input className="form-check-input" type="checkbox" id="40" checked={selectedSize.includes("40")} onChange={() => filter("size", "40")} />
                                                                <label className="form-check-label ms-2" htmlFor="40">40</label>
                                                            </div>
                                                            <div>
                                                                <input className="form-check-input" type="checkbox" id="42" checked={selectedSize.includes("42")} onChange={() => filter("size", "42")} />
                                                                <label className="form-check-label ms-2" htmlFor="42">42</label>
                                                            </div>
                                                            <div>
                                                                <input className="form-check-input" type="checkbox" id="44" checked={selectedSize.includes("44")} onChange={() => filter("size", "44")} />
                                                                <label className="form-check-label ms-2" htmlFor="44">44</label>
                                                            </div>
                                                        </div>
                                                        <hr />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </nav>
                            </div>
                            <div className="col-12 col-xl-10">
                                <div className="shop-right-sidebar">
                                    <div className="card rounded-0">
                                        <div className="card-body p-2">
                                            <div className="row">
                                                <div className="col-md-7">
                                                    <div className="view-type hstack gap-2 mb-3 w-100">
                                                        <form className='w-100' onSubmit={searchFilter}>
                                                            <div className="btn-group w-100">
                                                                <input type="search" name="search" onChange={(e) => setSearch(e.target.value)} value={search} placeholder='Search Product By Name,Color,Size,Category Etc' className='form-control w-100' />
                                                                <button type="submit" className='btn btn-dark'>Search</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                                <div className="col-md-2 col-6 mt-2">
                                                    <div className="text-center mb-3">{product.length} Items Found</div>
                                                </div>
                                                <div className="col-md-3 col-6">
                                                    <form className=' mb-3'>
                                                        <div className="input-group">
                                                            <span className="input-group-text bg-transparent rounded-0 border-0">Sort By</span>
                                                            <select className="form-select rounded-0" value={sortFilter} onChange={(e) => applySortFilter(e.target.value)}>
                                                                <option value="1">Whats'New</option>
                                                                <option value="2">Better Discount</option>
                                                                <option value="3">Price : Hight to Low</option>
                                                                <option value="4">Price : Low to Hight</option>
                                                            </select>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="product-grid mt-4">
                                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-5 g-4">
                                            {
                                                product.map(item => {
                                                    return <ProductCard item={item} key={item._id} />
                                                })
                                            }
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
