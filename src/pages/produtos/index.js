import "./index.css";
import produtoService from "../../services/produto-service";
import Swal from "sweetalert2";
import Produto from "../../models/produtos";

// HOOKs
import { useState, useEffect } from 'react'

export default function Produtos() {

    const [produtos, setProdutos] = useState ([]);
    const [produto, setProduto] = useState (new Produto());
    const [modoEdicao, setModoEdicao] = useState(false);

    // Vai executar toda vez que a tela for carrergada
    useEffect(() => {
        produtoService.obter()
            .then((response) => {
                setProdutos(response.data);
            })
            .catch(erro => { })
    }, []);

    const editar = (e) => {
        setModoEdicao(true);
        let produtoParaEditar = produtos.find(c => c.id == e.target.id);
        produtoParaEditar.dataCadastro = produtoParaEditar.dataCadastro.substring(0, 10);

        setProduto(produtoParaEditar);
    }

    const excluirProdutoNaLista = (produto) => {
        let indice = produtos.findIndex(c => c.id == produto.id);

        produtos.splice(indice, 1);

        setProdutos(arr => [...arr]);
    }

    const excluir = (e) => {
        let produtoParaExcluir = produtos.find(c => c.id == e.target.id);

        // eslint-disable-next-line no-restricted-globals
        if (confirm("Deseja realmente excluir o produto " + produtoParaExcluir.nome)) {
            produtoService.excluir(produtoParaExcluir.id)
                .then(() => {
                    excluirProdutoNaLista(produtoParaExcluir);
                })
        }
    }

    const salvar = () => {
        if (!produto.nome || !produto.valor) {
            Swal.fire({
                icon: 'error',
                text: 'Nome e valor são obrigatórios.'
            });

            return;
        }

        (modoEdicao)
            ? atualizarProdutoNoBackend(produto)
            : adicionarProdutoNoBackend(produto);
    }


    const atualizarProdutoNoBackend = (produto) => {
        produtoService.atualizar(produto)
        .then(response => {
            limparModal();

            Swal.fire({
                icon: 'success',
                title: `Produto ${produto.nome}, foi atualizado com sucesso!`,
                showConfirmButton: false,
                timer: 5000
            })

            let indice = produtos.findIndex(c => c.id == produto.id);
            produtos.splice(indice, 1, produto);

            setProdutos(lista => [...lista]);

        })
    }

    const adicionar = () => {
        setModoEdicao(false);
        limparModal();
    }

    const limparModal = () => {
         // Limpar modal de cliente com react
         setProduto({
            ...Produto,
            id: '',
            nome: '',
            valor: '',
            quantidadeEstoque: '',
            dataCadastro: '',
            observacao: '',
        });
    }

    const adicionarProdutoNoBackend = (produto) => {
        produtoService.adicionar(produto)
            .then(response => {
                setProdutos(lista => [...lista, new Produto(response.data)]);

               limparModal();

                Swal.fire({
                    icon: 'success',
                    title: `Produto ${produto.nome}, foi cadastrado com sucesso!`,
                    showConfirmButton: false,
                    timer: 6000
                })
            })
    }

    return (
        <div className="container">

            {/* Titulo */}
            <div className="row">
                <div className="col-sm-12">
                    <h4>produtos</h4>
                    <hr />
                </div>
            </div>

            {/* Botão para adicionar */}
            <div className="row">
                <div className="col-sm-3">
                    <button onClick={adicionar} id="btn-adicionar" className="btn btn-primary btn-sm " data-bs-toggle="modal"
                        data-bs-target="#modal-produto">Adicionar</button>
                </div>
            </div>

            {/* Tabela */}
            <div className="row mt-3">
                <div className="col-sm-12">
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                            <th>Id</th>
                            <th>Nome </th>
                            <th>Valor(R$) </th>
                            <th>Quantidade em estoque </th>
                            <th>Observação </th>
                            <th>Data de cadastro</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {produtos.map(produto => (
                                <tr>
                                    <td>{produto.id}</td>
                                    <td>{produto.nome}</td>
                                    <td>{produto.valor}</td>
                                    <td>{produto.quantidadeEstoque}</td>
                                    <td>{produto.observacao}</td>
                                    <td>{new Date(produto.dataCadastro).toLocaleDateString()}</td>
                                    <td>
                                        <button id={produto.id} onClick={editar} className="btn btn-light btn-sm" data-bs-toggle="modal"
                                            data-bs-target="#modal-produto">
                                            Editar
                                        </button>
                                        <button id={produto.id} onClick={excluir} className="btn btn-light btn-sm">
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* The Modal */}
            <div className="modal" id="modal-produto">
                <div className="modal-dialog">
                    <div className="modal-content">

                        {/* Modal Header */}
                        <div className="modal-header">
                            <h4 className="modal-title">{modoEdicao ? 'Editar produto' : 'Adicionar produto'}</h4>
                            <button  type="button" className="btn-close"></button>
                        </div>

                        {/* Modal body */}
                        <div className="modal-body">

                            <div className="row">

                                <div className="col-sm-2">
                                    <label for="id" className="form-label">Id</label>
                                    <input
                                        id="id"
                                        type="text"
                                        disabled
                                        className="form-control"
                                        value={produto.id}
                                        onChange={(e) => setProduto({ ...produto, id: e.target.value })}
                                    />
                                </div>

                                <div className="col-sm-10">
                                    <label for="nome" className="form-label">Nome</label>
                                    <input id="nome" type="text" className="form-control"
                                        value={produto.nome}
                                        onChange={(e) => setProduto({ ...produto, nome: e.target.value })} />
                                </div>
                            </div>

                            <div className="row">

                                <div className="col-sm-4">
                                      <label for="valor" className="form-label">Valor</label>
                                    <input id="valor" type="text" className="form-control"
                                        value={produto.valor}
                                        onChange={(e) => setProduto({ ...produto, valor: e.target.value })} />
                                </div>

                                <div className="col-sm-2">
                                    <label for="quantidadeEstoque" className="form-label">Estoque</label>
                                    <input id="quantidadeEstoque" type="text" className="form-control"
                                        value={produto.quantidadeEstoque}
                                        onChange={(e) => setProduto({ ...produto, quantidadeEstoque: e.target.value })} />
                                </div>

                                <div className="col-sm-3">
                                    <label for="observacao" className="form-label">Observação</label>
                                    <input id="observacao" type="text" className="form-control" maxlength="14"
                                        value={produto.observacao}
                                        onChange={(e) => setProduto({ ...produto, observacao: e.target.value })} />
                                </div>

                                <div className="col-sm-3">
                                    <label for="dataCadastro" className="form-label">Data de Cadastro</label>
                                    <input id="dataCadastro" type="date" className="form-control"
                                        value={produto.dataCadastro}
                                        onChange={(e) => setProduto({ ...produto, dataCadastro: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        {/* Modal footer */}
                        <div className="modal-footer">
                            <button onClick={salvar} id="btn-salvar" type="button" className="btn btn-primary btn-sm">Salvar</button>
                            <button id="btn-cancelar" type="button" className="btn btn-light btn-sm" data-bs-dismiss="modal">Cancelar</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}