const { Router } = require('express')
const router = Router()
const ProductManager = require('../index')
const productManager = new ProductManager('../../archivo/products.json')


router.get('/', async (req, res) => {
    try {
        //leo el parametro de consulta limit para la query
        const { limit } = req.query
        // traigo todos los productos
        const products = await productManager.getProducts()
        //realizo una validacion para saber si existe limit , si no, traigo todos los productos.
        if (!(isNaN(limit) || limit <= 0)) {    
            productsFilter = products.slice (0, limit)
            return res.json ({ productsFilter })
        }
        res.json ({ products })
    } catch (error) {
        console.error ('Error al obtener los products:', error.message)
    }
})

router.get('/:pid', async (req, res) => {
    try {
        //utilizo params el id
        const { pid } = req.params
        //realizo una busqueda por id
        const filterById =  await productManager.getProductByID(pid)
        if (!filterById) {
            return res.status(404).json({ error: 'El producto con el id buscado no existe.'})
        } else {
            res.json ({filterById})
        }
    } catch (error) {
        console.error ('Error al obtener los products:', error.message)
    }
})

router.get('*', (req, res) => {
    res.status(404).json ({ error: 'Not Found'})
})

router.post('/', async (req, res) => {
    try {
        const { product } = req.body
        await productManager.addProduct(product)
        res.status(201).json ({message: 'Producto creado correctamente'})
    } catch (error) {
        console.error ('Error al cargar productos:', error.message)
    }
})


router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const { ...product } = req.body
        //valido que se envien todos los campos para actualizar
        if (!product.title || !product.description || !product.price || !product.code || !product.stock || !product.status || !product.category) {
            return res.status(404).json ({error: "Todos los campos son obligatorios. Producto no agregado."})
          }
        // Llama al método updateProduct y le envio el producto actualizado y el ID desde los parámetros
        await productManager.updateProduct({ ...product, id: parseInt(pid) })
        res.json({ message: 'Producto Actualizado correctamente' })
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto.' })
    }
})

router.delete ('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        await productManager.deleteProduct(parseInt(pid))
        res.json({ message: 'Producto borrado correctamente' })
    } catch (error) {
        res.status(500).json({ error: 'Error al borrar un producto.' })
    }
})


module.exports = router